
import React, { useState } from 'react';
import { ShieldCheck, Zap, Heart, Loader2, Copy, CheckCircle2, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../utils';

interface PaywallProps {
  onPaymentSuccess: (details: any) => void;
}

const Paywall: React.FC<PaywallProps> = ({ onPaymentSuccess }) => {
  const [step, setStep] = useState<'intro' | 'details' | 'confirm'>('intro');
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{ account: string, bank: string } | null>(null);

  // Note: In a real production environment, this account generation should happen
  // via a Vercel Serverless Function to keep the FLW_SECRET_KEY safe.
  const handleGenerateAccount = () => {
    setLoading(true);
    triggerHaptic(10);
    
    // Simulate API call to Flutterwave /charge endpoint
    // This generates a virtual account number for the user
    setTimeout(() => {
      setPaymentInfo({
        account: "782" + Math.floor(1000000 + Math.random() * 9000000),
        bank: "Wema Bank (Zikr V2 Virtual)"
      });
      setStep('details');
      setLoading(false);
      triggerHaptic([50, 100, 50]);
    }, 2000);
  };

  const handleVerify = () => {
    setLoading(true);
    triggerHaptic(20);
    
    // Simulate payment verification
    setTimeout(() => {
      onPaymentSuccess({
        transaction_id: "FLW-" + Date.now(),
        amount: 5,
        currency: "NGN",
        customer: { name: "Premium User", email: "user@zikrv2.com" }
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-between p-8 safe-top safe-bottom z-[100] animate-ios">
      {/* Header & Logo */}
      <div className="flex flex-col items-center space-y-6 mt-12">
        <div className="relative group">
          <div className="absolute -inset-4 bg-blue-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src="/logo.png" 
            alt="Zikr Logo" 
            className="w-24 h-24 rounded-[2rem] shadow-2xl border border-white/10 relative z-10"
            onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/initials/svg?seed=Zikr')}
          />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">Zikr V2</h1>
          <p className="text-blue-500 text-xs font-bold uppercase tracking-[0.3em]">Premium Edition</p>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="w-full max-w-sm flex-1 flex flex-col justify-center">
        {step === 'intro' && (
          <div className="space-y-8 animate-ios">
            <div className="space-y-4">
              {[
                { icon: <Zap size={18} />, title: "Native Experience", desc: "iOS-quality fluid animations" },
                { icon: <ShieldCheck size={18} />, title: "Full Admin Panel", desc: "Complete session & user analytics" },
                { icon: <Heart size={18} />, title: "Spiritual AI", desc: "Powered by Gemini 3 Flash" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-zinc-900/40 rounded-2xl border border-white/5">
                  <div className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">{item.icon}</div>
                  <div>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="text-xs text-white/30">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setStep('details')}
              className="w-full h-16 bg-white text-black font-black rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-xl"
            >
              <span>Unlock for ₦5</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6 animate-ios text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Transfer to Activate</h2>
              <p className="text-white/40 text-xs px-8">Transfer exactly ₦5 to the account below to unlock the app instantly.</p>
            </div>

            <div className="bg-zinc-900/80 rounded-3xl border border-white/10 p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <CheckCircle2 size={80} />
              </div>
              
              {!paymentInfo ? (
                <div className="py-8 flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-blue-500 animate-spin"></div>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Generating Account...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Bank Name</p>
                    <p className="text-lg font-bold">{paymentInfo.bank}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Account Number</p>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-3xl font-black tracking-tighter tabular-nums">{paymentInfo.account}</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(paymentInfo.account);
                          triggerHaptic(5);
                        }}
                        className="p-2 bg-white/5 rounded-lg active:bg-white/10"
                      >
                        <Copy size={16} className="text-white/40" />
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] font-bold text-white/20 uppercase">Amount Due</p>
                    <p className="text-xl font-black">₦5.00</p>
                  </div>
                </>
              )}
            </div>

            {!paymentInfo ? (
              <button 
                onClick={handleGenerateAccount}
                className="w-full h-16 bg-blue-600 font-bold rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                Generate Account Number
              </button>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full h-16 bg-green-600 font-bold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <span>I Have Made Payment</span>}
                </button>
                <button onClick={() => setStep('intro')} className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Cancel Transaction</button>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="text-[10px] text-white/20 font-medium pb-4">
        Securely processed by Flutterwave API v3
      </footer>
    </div>
  );
};

export default Paywall;
