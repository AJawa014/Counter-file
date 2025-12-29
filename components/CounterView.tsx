
import React, { useState, useEffect, useCallback } from 'react';
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
    <div className="flex flex-col items-center justify-between h-full pt-12 pb-24 px-6 overflow-hidden">
      <div className="text-center space-y-2 animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-2xl font-bold tracking-tight text-white/90">{zikrName}</h1>
        <div className="flex items-center justify-center space-x-2 text-white/50 text-sm font-medium">
          <Target size={14} />
          <span>Target: {target}</span>
        </div>
      </div>

      <div className="relative group">
        {/* Progress Ring */}
        <svg className="w-80 h-80 -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            className="stroke-white/5 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="160"
            cy="160"
            r="140"
            className="stroke-blue-500 fill-none transition-all duration-300 ease-out"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 140}
            strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>

        {/* The Main Button */}
        <button
          onClick={handleTap}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex flex-col items-center justify-center transition-transform active:scale-95 ${
            isPressed ? 'scale-95 shadow-inner' : 'scale-100 shadow-2xl shadow-blue-500/10'
          }`}
        >
          <span className="text-7xl font-bold tracking-tighter tabular-nums transition-all">
            {currentCount}
          </span>
          {progress >= 100 && (
            <span className="mt-2 text-xs font-bold text-blue-400 uppercase tracking-widest animate-pulse">
              Target Reached
            </span>
          )}
        </button>
      </div>

      <div className="w-full flex justify-center space-x-12">
        <button 
          onClick={() => {
            if(window.confirm('Reset current count?')) {
              onReset();
              triggerHaptic([30, 20, 30]);
            }
          }}
          className="flex flex-col items-center space-y-1 text-white/40 hover:text-white/80 active:scale-90 transition-all"
        >
          <div className="p-4 rounded-2xl bg-white/5">
            <RefreshCcw size={24} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Reset</span>
        </button>

        <button 
          onClick={() => {
            const next = prompt('Set new target:', target.toString());
            if (next && !isNaN(parseInt(next))) onUpdateTarget(parseInt(next));
          }}
          className="flex flex-col items-center space-y-1 text-white/40 hover:text-white/80 active:scale-90 transition-all"
        >
          <div className="p-4 rounded-2xl bg-white/5">
            <Settings2 size={24} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default CounterView;
