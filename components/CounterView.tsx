
import React, { useState, useCallback } from 'react';
import { triggerHaptic } from '../utils';
import { RefreshCcw, Settings2, Target } from 'lucide-react';

interface CounterViewProps {
  currentCount: number;
  onIncrement: () => void;
  onReset: () => void;
  onUpdateTarget: (val: number) => void;
  target: number;
  zikrName: string;
}

const CounterView: React.FC<CounterViewProps> = ({ 
  currentCount, 
  onIncrement, 
  onReset, 
  onUpdateTarget, 
  target,
  zikrName 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTap = useCallback(() => {
    setIsPressed(true);
    onIncrement();
    triggerHaptic(20);
    setTimeout(() => setIsPressed(false), 100);
  }, [onIncrement]);

  const progress = Math.min((currentCount / target) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-between h-full pt-16 pb-24 px-6 overflow-hidden safe-top">
      <div className="flex flex-col items-center space-y-4 animate-ios">
        <img src="/logo.png" className="w-10 h-10 rounded-xl border border-white/10 shadow-lg" />
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-white/90">{zikrName}</h1>
          <div className="flex items-center justify-center space-x-2 text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
            <Target size={12} />
            <span>Goal: {target}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg className="w-80 h-80 -rotate-90">
          <circle cx="160" cy="160" r="140" className="stroke-white/5 fill-none" strokeWidth="6" />
          <circle
            cx="160" cy="160" r="140"
            className="stroke-blue-500 fill-none transition-all duration-300 ease-out"
            strokeWidth="6"
            strokeDasharray={2 * Math.PI * 140}
            strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>

        <button
          onClick={handleTap}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 flex flex-col items-center justify-center transition-all duration-75 ${
            isPressed ? 'scale-95 brightness-125' : 'scale-100 shadow-[0_0_50px_rgba(59,130,246,0.1)]'
          }`}
        >
          <span className="text-8xl font-black tracking-tighter tabular-nums">{currentCount}</span>
        </button>
      </div>

      <div className="w-full flex justify-center space-x-16">
        <button onClick={onReset} className="flex flex-col items-center space-y-2 group">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 group-active:scale-90 transition-transform">
            <RefreshCcw size={20} className="text-white/40" />
          </div>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Reset</span>
        </button>
        <button 
          onClick={() => {
            const next = prompt('New Target:', target.toString());
            if (next && !isNaN(parseInt(next))) onUpdateTarget(parseInt(next));
          }}
          className="flex flex-col items-center space-y-2 group"
        >
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 group-active:scale-90 transition-transform">
            <Settings2 size={20} className="text-white/40" />
          </div>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Target</span>
        </button>
      </div>
    </div>
  );
};

export default CounterView;
