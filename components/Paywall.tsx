
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Heart, Loader2, Copy, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
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
    tx_ref: string 
  } | null>(null);

  const FLW_SECRET_KEY = (process.env as any).FLW_SECRET_KEY;
  const FLW_PUBLIC_KEY = (process.env as any).FLW_PUBLIC_KEY;

  const handleGenerateAccount = async () => {
    setLoading(true);
    setError(null);
    triggerHaptic(10);

    const tx_ref = `ZIKR-V2-${Date.now()}`;
    const email = `user-${Math.floor(Math.random() * 100000)}@zikrv2.com`;

    try {
      // Direct call to Flutterwave Charge API for Bank Transfer
      const response = await fetch('https://api.flutterwave.com/v3/charges?type=bank_transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: tx_ref,
          amount: "5",
          currency: "NGN",
          email: email,
          is_permanent: false,
          fullname: "Zikr V2 Premium User",
        }),
      });

      const data = await response.json();

      if (data.status === 'success' && data.meta?.authorization) {
        setPaymentInfo({
          account: data.meta.authorization.transfer_account,
          bank: data.meta.authorization.transfer_bank,
          amount: data.meta.authorization.transfer_amount,
          tx_ref: tx_ref
        });
        setStep('details');
        triggerHaptic([50, 100, 50]);
      } else {
        throw new Error(data.message || 'Failed to generate account');
      }
    } catch (err: any) {
      console.error("FLW Error:", err);
      setError(err.message || "Connection to payment gateway failed.");
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
      // Verify transaction using tx_ref
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${paymentInfo.tx_ref}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${FLW_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });

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
        setError("Payment not yet detected. Please ensure you've sent the ₦5 and wait a few moments.");
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
        <div className="relative">
          <img 
            src="/logo.png" 
            alt="Zikr Logo" 
            className="w-24 h-24 rounded-[2rem] shadow-2xl border border-white/10 relative z-10"
            onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/initials/svg?seed=Zikr')}
          />
          <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl"></div>
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">Zikr V2</h1>
          <p className="text-blue-500 text-xs font-bold uppercase tracking-[0.3em]">Direct Activation</p>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="w-full max-w-sm flex-1 flex flex-col justify-center">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-3 animate-ios">
            <AlertCircle className="text-red-500 shrink-0" size={18} />
            <p className="text-xs text-red-200/80 leading-relaxed font-medium">{error}</p>
          </div>
        )}

        {step === 'intro' && (
          <div className="space-y-8 animate-ios">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-5 bg-zinc-900/40 rounded-3xl border border-white/5">
                <div className="text-blue-500 bg-blue-500/10 p-2.5 rounded-xl"><Zap size={20} /></div>
                <div>
                  <h3 className="text-sm font-bold">Lifetime Access</h3>
                  <p className="text-xs text-white/30">Pay once, use forever on this device.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-5 bg-zinc-900/40 rounded-3xl border border-white/5">
                <div className="text-green-500 bg-green-500/10 p-2.5 rounded-xl"><ShieldCheck size={20} /></div>
                <div>
                  <h3 className="text-sm font-bold">Safe & Private</h3>
                  <p className="text-xs text-white/30">Encrypted payments via Flutterwave.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleGenerateAccount}
              disabled={loading}
              className="w-full h-16 bg-white text-black font-black rounded-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <span>Unlock for ₦5</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        )}

        {step === 'details' && paymentInfo && (
          <div className="space-y-6 animate-ios text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Send exactly ₦{paymentInfo.amount}</h2>
              <p className="text-white/40 text-[11px] px-8">Transfer to the secure virtual account below. Your app will unlock once confirmed.</p>
            </div>

            <div className="bg-zinc-900/80 rounded-[2.5rem] border border-white/10 p-8 space-y-6 relative overflow-hidden">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Bank Name</p>
                <p className="text-xl font-bold">{paymentInfo.bank}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Account Number</p>
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-4xl font-black tracking-tighter tabular-nums text-white group-active:text-blue-400 transition-colors">
                    {paymentInfo.account}
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(paymentInfo.account);
                      triggerHaptic(5);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Copy size={14} className="text-white/40" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Copy Account</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/20">
                  <span>Reference</span>
                  <span className="font-mono">{paymentInfo.tx_ref.slice(-8)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleVerify}
                disabled={loading}
                className="w-full h-16 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <span>I Have Paid ₦{paymentInfo.amount}</span>}
              </button>
              <button 
                onClick={() => setStep('intro')} 
                className="text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-white/40 transition-colors"
              >
                Cancel & Go Back
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] pb-4">
        Live Virtual Account • FLW Engine
      </footer>
    </div>
  );
};

export default Paywall;
