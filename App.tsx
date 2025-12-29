
import React, { useState, useEffect } from 'react';
import { Tab, ZikrSession, PaymentLog } from './types';
import CounterView from './components/CounterView';
import HistoryView from './components/HistoryView';
import AIView from './components/AIView';
import Paywall from './components/Paywall';
import AdminDashboard from './components/AdminDashboard';
import { triggerHaptic } from './utils';
import { Circle, History as HistoryIcon, Sparkles, Settings as SettingsIcon, ShieldCheck, Database } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.COUNTER);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [zikrName, setZikrName] = useState('SubhanAllah');
  const [history, setHistory] = useState<ZikrSession[]>([]);
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Load persisted state
    const savedCount = localStorage.getItem('zikr_current_count');
    const savedTarget = localStorage.getItem('zikr_target');
    const savedName = localStorage.getItem('zikr_name');
    const savedHistory = localStorage.getItem('zikr_history');
    const savedPaid = localStorage.getItem('zikr_has_paid_v2');
    const savedLogs = localStorage.getItem('zikr_payment_logs_v2');

    if (savedCount) setCount(parseInt(savedCount));
    if (savedTarget) setTarget(parseInt(savedTarget));
    if (savedName) setZikrName(savedName);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedPaid === 'true') setHasPaid(true);
    if (savedLogs) setPaymentLogs(JSON.parse(savedLogs));
    
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      localStorage.setItem('zikr_current_count', count.toString());
      localStorage.setItem('zikr_target', target.toString());
      localStorage.setItem('zikr_name', zikrName);
      localStorage.setItem('zikr_history', JSON.stringify(history));
      localStorage.setItem('zikr_has_paid_v2', hasPaid.toString());
      localStorage.setItem('zikr_payment_logs_v2', JSON.stringify(paymentLogs));
    }
  }, [count, target, zikrName, history, hasPaid, paymentLogs, isInitializing]);

  const handlePaymentSuccess = (details: any) => {
    const newLog: PaymentLog = {
      id: details.transaction_id,
      amount: details.amount,
      currency: details.currency,
      customerName: details.customer.name,
      customerEmail: details.customer.email,
      timestamp: Date.now(),
      status: 'successful'
    };
    setPaymentLogs(prev => [...prev, newLog]);
    setHasPaid(true);
    triggerHaptic([50, 100, 50, 100, 50]);
  };

  const incrementCount = () => {
    setCount(prev => prev + 1);
    if (count + 1 === target) triggerHaptic([100, 50, 100]);
  };

  const resetCount = () => {
    if (count > 0) {
      const newSession: ZikrSession = {
        id: Date.now().toString(),
        name: zikrName,
        count: count,
        target: target,
        timestamp: Date.now()
      };
      setHistory(prev => [...prev, newSession]);
    }
    setCount(0);
    triggerHaptic(10);
  };

  if (isInitializing) return <div className="bg-black min-h-screen" />;
  if (!hasPaid) return <Paywall onPaymentSuccess={handlePaymentSuccess} />;

  const renderContent = () => {
    switch (activeTab) {
      case Tab.COUNTER:
        return (
          <CounterView 
            currentCount={count} 
            onIncrement={incrementCount}
            onReset={resetCount}
            onUpdateTarget={setTarget}
            target={target}
            zikrName={zikrName}
          />
        );
      case Tab.HISTORY:
        return <HistoryView history={history} onClearHistory={() => setHistory([])} />;
      case Tab.AI:
        return <AIView currentZikr={zikrName} />;
      case Tab.SETTINGS:
        return (
          <div className="flex flex-col h-full bg-black pt-16 pb-24 px-6 space-y-8 overflow-y-auto safe-top animate-ios">
            <header className="space-y-1">
              <h2 className="text-3xl font-black text-white tracking-tight">V2 Settings</h2>
              <p className="text-white/40 text-sm">Personalize your spiritual dashboard</p>
            </header>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-2">Active Zikr</label>
                <input 
                  type="text"
                  value={zikrName}
                  onChange={(e) => setZikrName(e.target.value)}
                  className="w-full h-16 bg-zinc-900/50 border border-white/5 rounded-2xl px-6 text-white text-lg focus:border-blue-500/50 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-2">Security & Access</label>
                <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden divide-y divide-white/5">
                  <div className="p-5 flex justify-between items-center group active:bg-white/5 transition-all" onDoubleClick={() => { setShowAdmin(true); triggerHaptic(20); }}>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                        <ShieldCheck size={20} />
                      </div>
                      <span className="text-white/90 font-bold">Premium Status</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                  </div>
                  
                  <div 
                    className="p-5 flex justify-between items-center text-white/40 active:bg-white/5 transition-all"
                    onClick={() => {
                      const pass = prompt('V2 Terminal Authorization Required:');
                      if (pass === (process.env as any).ADMIN_PASSWORD) {
                        setShowAdmin(true);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white/5 rounded-xl">
                        <Database size={20} />
                      </div>
                      <span className="font-bold">Admin Terminal</span>
                    </div>
                    <span className="text-xs">Access</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-[2.5rem] flex flex-col items-center text-center space-y-4">
                <img src="/logo.png" className="w-20 h-20 rounded-3xl shadow-2xl border border-white/10" />
                <div className="space-y-1">
                  <p className="text-xl font-black text-white">Zikr Digital V2</p>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Build 2.0.1 Stable</p>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed px-2 font-medium">
                  Experience the ultimate spiritual companion. Every tap is a step closer. Built for the community.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col font-sans select-none overflow-hidden">
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} payments={paymentLogs} />}
      <main className="flex-1 overflow-hidden">{renderContent()}</main>
      <nav className="ios-blur bg-black/60 border-t border-white/5 safe-bottom z-50">
        <div className="flex justify-around items-center h-20 px-4">
          {[
            { tab: Tab.COUNTER, label: 'Tasbih', icon: <Circle size={22} fill={activeTab === Tab.COUNTER ? 'currentColor' : 'none'} /> },
            { tab: Tab.HISTORY, label: 'Journal', icon: <HistoryIcon size={22} /> },
            { tab: Tab.AI, label: 'Wisdom', icon: <Sparkles size={22} fill={activeTab === Tab.AI ? 'currentColor' : 'none'} /> },
            { tab: Tab.SETTINGS, label: 'Settings', icon: <SettingsIcon size={22} /> },
          ].map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); triggerHaptic(5); }}
              className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-all ${activeTab === tab ? 'text-blue-500 scale-110' : 'text-zinc-500'}`}
            >
              <div className="mb-1">{icon}</div>
              <span className="text-[9px] font-black tracking-widest uppercase">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
