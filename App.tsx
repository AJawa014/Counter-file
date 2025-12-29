
import React, { useState, useEffect } from 'react';
import { Tab, ZikrSession } from './types';
import CounterView from './components/CounterView';
import HistoryView from './components/HistoryView';
import AIView from './components/AIView';
import { triggerHaptic } from './utils';
import { Circle, History as HistoryIcon, Sparkles, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.COUNTER);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [zikrName, setZikrName] = useState('SubhanAllah');
  const [history, setHistory] = useState<ZikrSession[]>([]);

  // Load from local storage
  useEffect(() => {
    const savedCount = localStorage.getItem('zikr_current_count');
    const savedTarget = localStorage.getItem('zikr_target');
    const savedName = localStorage.getItem('zikr_name');
    const savedHistory = localStorage.getItem('zikr_history');

    if (savedCount) setCount(parseInt(savedCount));
    if (savedTarget) setTarget(parseInt(savedTarget));
    if (savedName) setZikrName(savedName);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('zikr_current_count', count.toString());
    localStorage.setItem('zikr_target', target.toString());
    localStorage.setItem('zikr_name', zikrName);
    localStorage.setItem('zikr_history', JSON.stringify(history));
  }, [count, target, zikrName, history]);

  const incrementCount = () => {
    setCount(prev => prev + 1);
    // Auto-save history when target reached exactly (first time per cycle)
    if (count + 1 === target) {
      triggerHaptic([50, 50, 50]);
    }
  };

  const resetCount = () => {
    // Before resetting, save current session if it was significant
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
        return (
          <HistoryView 
            history={history} 
            onClearHistory={() => setHistory([])} 
          />
        );
      case Tab.AI:
        return <AIView currentZikr={zikrName} />;
      case Tab.SETTINGS:
        return (
          <div className="flex flex-col h-full bg-black pt-16 pb-24 px-6 space-y-6 overflow-y-auto">
            <h2 className="text-3xl font-bold text-white tracking-tight">Preferences</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2">Zikr Phrase</label>
                <input 
                  type="text"
                  value={zikrName}
                  onChange={(e) => setZikrName(e.target.value)}
                  placeholder="e.g. SubhanAllah"
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:ring-1 ring-blue-500/50"
                />
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-white/80">Haptic Feedback</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center opacity-40">
                  <span className="text-white/80">Dark Mode</span>
                  <span className="text-xs font-semibold">Always On</span>
                </div>
                <div className="p-4 flex justify-between items-center opacity-40">
                   <span className="text-white/80">iCloud Sync</span>
                   <span className="text-xs font-semibold">Native Only</span>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-white/5 rounded-3xl">
                <p className="text-[10px] font-bold text-white/20 uppercase mb-2">About Zikr Web</p>
                <p className="text-xs text-white/50 leading-relaxed">
                  Version 1.0.0 (Preview)<br/>
                  Built with React & Gemini AI for the best spiritual experience on the web.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { tab: Tab.COUNTER, label: 'Counter', icon: <Circle size={22} fill={activeTab === Tab.COUNTER ? 'currentColor' : 'none'} /> },
    { tab: Tab.HISTORY, label: 'Journal', icon: <HistoryIcon size={22} /> },
    { tab: Tab.AI, label: 'Wisdom', icon: <Sparkles size={22} fill={activeTab === Tab.AI ? 'currentColor' : 'none'} /> },
    { tab: Tab.SETTINGS, label: 'Settings', icon: <SettingsIcon size={22} fill={activeTab === Tab.SETTINGS ? 'currentColor' : 'none'} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>

      {/* iOS Bottom Navigation Bar */}
      <nav className="ios-blur bg-black/60 border-t border-white/5 safe-bottom z-50">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                triggerHaptic(5);
              }}
              className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-all duration-300 ${
                activeTab === tab ? 'text-blue-500 scale-110' : 'text-zinc-500'
              }`}
            >
              <div className="relative">
                {icon}
                {tab === Tab.COUNTER && count > 0 && activeTab !== Tab.COUNTER && (
                   <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-black" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight leading-none">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
