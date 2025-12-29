
import React, { useState, useCallback } from 'react';
import { triggerHaptic } from '../utils';
import { RefreshCcw, Settings2, Target, Share2 } from 'lucide-react';

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
    triggerHaptic(25);
    setTimeout(() => setIsPressed(false), 80);
  }, [onIncrement]);

  const progress = Math.min((currentCount / target) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-between h-full pt-16 pb-28 px-6 overflow-hidden safe-top">
      {/* Branding & Zikr Name */}
      <div className="flex flex-col items-center space-y-4 animate-ios">
        <div className="relative">
          <img src="/logo.png" className="w-12 h-12 rounded-2xl border border-white/10 shadow-2xl relative z-10" />
          <div className="absolute -inset-2 bg-blue-500/10 blur-lg rounded-full"></div>
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-white">{zikrName}</h1>
          <div className="flex items-center justify-center space-x-2 text-blue-500/60 text-[9px] font-black uppercase tracking-[0.2em]">
            <Target size={10} strokeWidth={3} />
            <span>Target: {target}</span>
          </div>
        </div>
      </div>

      {/* Main Counter UI */}
      <div className="relative group cursor-pointer" onClick={handleTap}>
        <svg className="w-[320px] h-[320px] -rotate-90 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.1)]">
          <circle cx="160" cy="160" r="145" className="stroke-white/5 fill-none" strokeWidth="8" />
          <circle
            cx="160" cy="160" r="145"
            className="stroke-blue-500 fill-none transition-all duration-300 ease-out"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 145}
            strokeDashoffset={2 * Math.PI * 145 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>

        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 flex flex-col items-center justify-center transition-all duration-75 shadow-2xl ${
            isPressed ? 'scale-90 brightness-150' : 'scale-100 group-hover:scale-105'
          }`}
        >
          <div className="text-[120px] font-black tracking-tighter tabular-nums leading-none mb-2">{currentCount}</div>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Tap to Count</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full grid grid-cols-3 gap-8 max-w-xs">
        <button onClick={onReset} className="flex flex-col items-center space-y-2 group">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-active:scale-90 group-hover:border-red-500/20 transition-all">
            <RefreshCcw size={20} className="text-white/30 group-hover:text-red-500 transition-colors" />
          </div>
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Reset</span>
        </button>
        
        <button 
          onClick={() => {
            const next = prompt('Define New Target:', target.toString());
            if (next && !isNaN(parseInt(next))) {
              onUpdateTarget(parseInt(next));
              triggerHaptic(10);
            }
          }}
          className="flex flex-col items-center space-y-2 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-active:scale-90 group-hover:border-blue-500/20 transition-all">
            <Settings2 size={20} className="text-white/30 group-hover:text-blue-500 transition-colors" />
          </div>
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Target</span>
        </button>

        <button onClick={() => alert('V2 Sharing coming soon!')} className="flex flex-col items-center space-y-2 group">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-active:scale-90 group-hover:border-green-500/20 transition-all">
            <Share2 size={20} className="text-white/30 group-hover:text-green-500 transition-colors" />
          </div>
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Share</span>
        </button>
      </div>
    </div>
  );
};

export default CounterView;
