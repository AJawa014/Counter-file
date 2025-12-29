
import React, { useState } from 'react';
import { ShieldCheck, Zap, Heart, Loader2 } from 'lucide-react';

interface PaywallProps {
  onPaymentSuccess: (details: any) => void;
}

const Paywall: React.FC<PaywallProps> = ({ onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    const config = {
      public_key: (process.env as any).FLW_PUBLIC_KEY || 'FLWPUBK_TEST-REPLACE-WITH-ACTUAL',
      tx_ref: "ZIKR-" + Date.now(),
      amount: 5,
      currency: "NGN",
      payment_options: "card, account, banktransfer",
      customer: {
        email: "user@zikrapp.com",
        name: "Valued User",
      },
      customizations: {
        title: "Zikr V2 Premium",
        description: "Lifetime access to Digital Tasbih",
        logo: window.location.origin + "/logo.png",
      },
      callback: (data: any) => {
        if (data.status === "successful") {
          onPaymentSuccess(data);
        }
        setLoading(false);
      },
      onclose: () => {
        setLoading(false);
      },
    };

    // @ts-ignore
    window.FlutterwaveCheckout(config);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-between p-8 safe-top safe-bottom z-[100] animate-ios">
      <div className="flex flex-col items-center space-y-6 mt-12">
        <img src="/logo.png" alt="Zikr Logo" className="w-24 h-24 rounded-3xl shadow-2xl border border-white/10" />
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Zikr V2</h1>
          <p className="text-white/50 font-medium">Elevate your spiritual practice</p>
        </div>
      </div>

      <div className="w-full space-y-6 max-w-sm">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Full AI Insights</h3>
              <p className="text-xs text-white/40">Powered by Gemini for deep meaning</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Unlimited Journal</h3>
              <p className="text-xs text-white/40">Track every session forever</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500">
              <Heart size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Premium iOS Feel</h3>
              <p className="text-xs text-white/40">Fluid animations & native haptics</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 text-center space-y-2">
          <span className="text-3xl font-bold">₦5</span>
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">One-time Lifetime Access</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full h-14 bg-white text-black font-bold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <span>Continue with Flutterwave</span>
          )}
        </button>
        
        <p className="text-[10px] text-center text-white/20">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Paywall;
