
import React, { useState } from 'react';
import { ShieldCheck, Zap, Heart, Loader2, Copy, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { triggerHaptic } from '../utils';

interface PaywallProps {
  onPaymentSuccess: (details: any) => void;
}

const Paywall: React.FC<PaywallProps> = ({ onPaymentSuccess }) => {
  const [step, setStep] = useState<'intro' | 'details'>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{ 
    account: string, 
    bank: string, 
    amount: number,
    tx_ref: string,
    expiry?: string
  } | null>(null);

  const handleGenerateAccount = async () => {
    setLoading(true);
    setError(null);
    triggerHaptic(10);

    const tx_ref = `ZIKR-V2-${Date.now()}`;
    const email = `user-${Math.floor(Math.random() * 100000)}@zikrv2.com`;

    try {
      // Fetch from our local Vercel API route (proxies to Flutterwave)
      // This fixes the CORS "Failed to fetch" error
      const response = await fetch('/api/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_ref: tx_ref,
          amount: "5",
          email: email,
          fullname: "Zikr V2 Premium User",
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API Connection Error. Please ensure you are running on Vercel.");
      }

      const data = await response.json();

      if (response.ok && data.status === 'success' && data.meta?.authorization) {
        setPaymentInfo({
          account: data.meta.authorization.transfer_account,
          bank: data.meta.authorization.transfer_bank,
          amount: parseFloat(data.meta.authorization.transfer_amount),
          tx_ref: tx_ref,
          expiry: data.meta.authorization.account_expiration
        });
        setStep('details');
        triggerHaptic([50, 100, 50]);
      } else {
        throw new Error(data.message || 'Failed to generate account. Try again.');
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      setError(err.message || "Connection failed. Check your internet.");
      triggerHaptic([100, 100]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!paymentInfo) return;
    setLoading(true);
    setError(null);
    triggerHaptic(20);

    try {
      // Check status via our backend
      const response = await fetch(`/api/verify?tx_ref=${paymentInfo.tx_ref}`);
      const data = await response.json();

      if (data.status === 'success' && data.data.status === 'successful') {
        onPaymentSuccess({
          transaction_id: data.data.id,
          amount: data.data.amount,
          currency: data.data.currency,
          customer: { 
            name: data.data.customer.name, 
            email: data.data.customer.email 
          }
        });
        triggerHaptic([50, 100, 50, 100]);
      } else {
        setError("Payment not yet confirmed. It may take 1-2 minutes to reflect.");
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-between p-8 safe-top safe-bottom z-[100] animate-ios">
      {/* Header & Logo */}
      <div className="flex flex-col items-center space-y-6 mt-12">
        <div className="relative group">
          <div className="absolute -inset-6 bg-blue-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src="/logo.png" 
            alt="Zikr Logo" 
            className="w-24 h-24 rounded-[2rem] shadow-2xl border border-white/10 relative z-10"
            onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/initials/svg?seed=Zikr')}
          />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">Zikr V2</h1>
          <p className="text-blue-500 text-xs font-bold uppercase tracking-[0.3em]">Premium Access</p>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="w-full max-w-sm flex-1 flex flex-col justify-center">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-3 animate-ios">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-red-200/90 leading-relaxed font-medium">{error}</p>
          </div>
        )}

        {step === 'intro' && (
          <div className="space-y-8 animate-ios">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-5 bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-lg">
                <div className="text-blue-500 bg-blue-500/10 p-3 rounded-2xl"><Zap size={20} /></div>
                <div>
                  <h3 className="text-sm font-bold text-white">Instant Unlock</h3>
                  <p className="text-xs text-white/40 font-medium">Generate a personal account number.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-5 bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-lg">
                <div className="text-green-500 bg-green-500/10 p-3 rounded-2xl"><ShieldCheck size={20} /></div>
                <div>
                  <h3 className="text-sm font-bold text-white">Secure Transfer</h3>
                  <p className="text-xs text-white/40 font-medium">Powered by Flutterwave Infrastructure.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleGenerateAccount}
              disabled={loading}
              className="w-full h-16 bg-white text-black font-black rounded-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <span>Activate for ₦5</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-white/20 font-medium">
              By continuing, you agree to our Terms of Service.
            </p>
          </div>
        )}

        {step === 'details' && paymentInfo && (
          <div className="space-y-6 animate-ios text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Transfer Request</h2>
              <p className="text-white/40 text-[11px] px-4">Send exactly <span className="text-white font-bold">₦{paymentInfo.amount}</span> to the virtual account below.</p>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 space-y-6 relative overflow-hidden shadow-2xl">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Bank Name</p>
                <p className="text-xl font-bold text-white tracking-tight">{paymentInfo.bank}</p>
              </div>
              
              <div className="space-y-3 relative z-10">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Account Number</p>
                <div className="flex flex-col items-center space-y-3">
                  <p className="text-4xl font-black tracking-tighter tabular-nums text-white selection:bg-blue-500/30">
                    {paymentInfo.account}
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInfo.account);
                      triggerHaptic(5);
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors active:scale-95"
                  >
                    <Copy size={14} className="text-white/60" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Copy Number</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/20 relative z-10">
                <span>Ref: {paymentInfo.tx_ref.slice(-6)}</span>
                <div className="flex items-center space-x-1 text-green-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Awaiting</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                onClick={handleVerify}
                disabled={loading}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <CheckCircle2 size={20} />
                    <span>I Have Made Payment</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={() => handleVerify()} 
                className="flex items-center justify-center space-x-2 text-white/30 text-[10px] font-bold uppercase tracking-widest hover:text-white/50 transition-colors py-2"
              >
                <RefreshCw size={12} />
                <span>Check Status Again</span>
              </button>
              
              <button 
                onClick={() => setStep('intro')} 
                className="text-red-400/50 text-[10px] font-bold uppercase tracking-widest hover:text-red-400 transition-colors"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] pb-4 flex items-center space-x-2">
        <ShieldCheck size={10} />
        <span>Secured by Flutterwave</span>
      </footer>
    </div>
  );
};

export default Paywall;
