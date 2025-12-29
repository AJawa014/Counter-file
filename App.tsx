
import React, { useState, useEffect } from 'react';
import { Tab, ZikrSession, PaymentLog } from './types';
import CounterView from './components/CounterView';
import HistoryView from './components/HistoryView';
import AIView from './components/AIView';
import Paywall from './components/Paywall';
import AdminDashboard from './components/AdminDashboard';
import { triggerHaptic } from './utils';
import { Circle, History as HistoryIcon, Sparkles, Settings as SettingsIcon, LayoutGrid } from 'lucide-react';

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
    const savedCount = localStorage.getItem('zikr_current_count');
    const savedTarget = localStorage.getItem('zikr_target');
    const savedName = localStorage.getItem('zikr_name');
    const savedHistory = localStorage.getItem('zikr_history');
    const savedPaid = localStorage.getItem('zikr_has_paid');
    const savedLogs = localStorage.getItem('zikr_payment_logs');

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
      localStorage.setItem('zikr_has_paid', hasPaid.toString());
      localStorage.setItem('zikr_payment_logs', JSON.stringify(paymentLogs));
    }
  }, [count, target, zikrName, history, hasPaid, paymentLogs, isInitializing]);

  const handlePaymentSuccess = (details: any) => {
    const newLog: PaymentLog = {
      id: details.transaction_id,
      amount: details.amount,
      currency: details.currency,
      customerName: "Premium User",
      customerEmail: "user@zikrapp.com",
      timestamp: Date.now(),
      status: 'successful'
    };
    setPaymentLogs(prev => [...prev, newLog]);
    setHasPaid(true);
    triggerHaptic([50, 100, 50]);
  };

  const incrementCount = () => {
    setCount(prev => prev + 1);
    if (count + 1 === target) triggerHaptic([50, 50, 50]);
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
          <div className="flex flex-col h-full bg-black pt-16 pb-24 px-6 space-y-6 overflow-y-auto safe-top">
            <h2 className="text-3xl font-bold text-white tracking-tight">Preferences</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2">Zikr Phrase</label>
                <input 
                  type="text"
                  value={zikrName}
                  onChange={(e) => setZikrName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white"
                />
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                <div className="p-4 flex justify-between items-center" onDoubleClick={() => setShowAdmin(true)}>
                  <span className="text-white/80">Account Type</span>
                  <span className="text-xs font-bold text-blue-500">Premium V2</span>
                </div>
                <div 
                  className="p-4 flex justify-between items-center text-white/40 active:bg-white/5"
                  onClick={() => {
                    const pass = prompt('Admin Code Required:');
                    if (pass === (process.env as any).ADMIN_PASSWORD) setShowAdmin(true);
                  }}
                >
                  <span>System Diagnostics</span>
                  <LayoutGrid size={16} />
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-white/5 rounded-3xl text-center">
                <img src="/logo.png" className="w-12 h-12 mx-auto rounded-xl mb-3 opacity-50" />
                <p className="text-[10px] font-bold text-white/20 uppercase">Zikr Digital Tasbih V2.0</p>
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
        <div className="flex justify-around items-center h-16 px-4">
          {[
            { tab: Tab.COUNTER, label: 'Counter', icon: <Circle size={22} fill={activeTab === Tab.COUNTER ? 'currentColor' : 'none'} /> },
            { tab: Tab.HISTORY, label: 'Journal', icon: <HistoryIcon size={22} /> },
            { tab: Tab.AI, label: 'Wisdom', icon: <Sparkles size={22} fill={activeTab === Tab.AI ? 'currentColor' : 'none'} /> },
            { tab: Tab.SETTINGS, label: 'Settings', icon: <SettingsIcon size={22} /> },
          ].map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); triggerHaptic(5); }}
              className={`flex flex-col items-center justify-center space-y-1 w-full h-full ${activeTab === tab ? 'text-blue-500' : 'text-zinc-500'}`}
            >
              {icon}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
