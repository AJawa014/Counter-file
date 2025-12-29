
import React from 'react';
import { ZikrSession } from '../types';
import { formatDate } from '../utils';
import { History, Trash2, Calendar } from 'lucide-react';

interface HistoryViewProps {
  history: ZikrSession[];
  onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onClearHistory }) => {
  return (
    <div className="flex flex-col h-full bg-black pt-16 pb-24 px-4 overflow-y-auto">
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Journal</h2>
          <p className="text-white/40 text-sm">Your spiritual journey</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={() => window.confirm('Clear all logs?') && onClearHistory()}
            className="text-red-500/80 text-sm font-medium p-2 active:bg-red-500/10 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-white/20 space-y-4">
          <History size={48} strokeWidth={1} />
          <p className="text-sm font-medium">No sessions recorded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.slice().reverse().map((session) => (
            <div 
              key={session.id}
              className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex justify-between items-center group active:scale-[0.98] transition-all"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-white/90">{session.name}</h3>
                <div className="flex items-center text-xs text-white/40 space-x-2">
                  <Calendar size={12} />
                  <span>{formatDate(session.timestamp)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-400 tabular-nums">{session.count}</div>
                <div className="text-[10px] font-bold text-white/20 uppercase">Total Taps</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
