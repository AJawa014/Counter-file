
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, BookOpen, Quote } from 'lucide-react';
import { getZikrInsight, getSpiritualSuggestion } from '../services/geminiService';
import { AIInsight } from '../types';

interface AIViewProps {
  currentZikr: string;
}

const AIView: React.FC<AIViewProps> = ({ currentZikr }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [insightData, suggestData] = await Promise.all([
      getZikrInsight(currentZikr),
      getSpiritualSuggestion()
    ]);
    setInsight(insightData);
    setSuggestion(suggestData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentZikr]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
        <p className="text-white/40 text-sm animate-pulse">Consulting the wisdom...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black pt-16 pb-24 px-6 overflow-y-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-white tracking-tight">Wisdom</h2>
        <p className="text-white/40 text-sm">Deepen your practice with AI</p>
      </div>

      {insight && (
        <section className="bg-zinc-900/40 rounded-3xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <Sparkles size={18} />
            <h3 className="font-bold uppercase tracking-widest text-xs">Insight on {currentZikr}</h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-lg font-serif italic text-white/90">"{insight.transliteration}"</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/20 uppercase">Meaning</span>
              <p className="text-sm text-white/70 leading-relaxed">{insight.meaning}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/20 uppercase">Spiritual Benefit</span>
              <p className="text-sm text-white/70 leading-relaxed">{insight.benefit}</p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-br from-blue-600/10 to-transparent rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center space-x-2 text-blue-400">
          <BookOpen size={18} />
          <h3 className="font-bold uppercase tracking-widest text-xs">Daily Suggestion</h3>
        </div>
        <p className="text-lg text-white/90 leading-snug">{suggestion}</p>
      </section>

      <div className="p-6 bg-white/5 rounded-2xl flex items-start space-x-4">
        <Quote className="text-white/20 shrink-0" size={24} />
        <p className="text-xs text-white/40 leading-relaxed italic">
          AI-generated insights are meant for educational and motivational purposes. Please consult scholars for deep theological matters.
        </p>
      </div>
    </div>
  );
};

export default AIView;
