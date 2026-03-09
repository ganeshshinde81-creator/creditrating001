
import React from 'react';
import { RatingResult, CreditRating } from '../types';
import { RATING_DESCRIPTIONS, RATING_SCALE } from '../constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, Target } from 'lucide-react';

interface Props {
  result: RatingResult;
  targetRating: CreditRating;
  onTargetChange: (rating: CreditRating) => void;
}

export const RatingDashboard: React.FC<Props> = ({ result, targetRating, onTargetChange }) => {
  const radarData = [
    { subject: 'Debt/EBITDA', value: Math.min(100, (result.benchmarks.debtToEbitda.good / result.ratios.debtToEbitda) * 100), fullMark: 100 },
    { subject: 'Int Coverage', value: Math.min(100, (result.ratios.interestCoverage / result.benchmarks.interestCoverage.good) * 100), fullMark: 100 },
    { subject: 'Debt/Equity', value: Math.min(100, (result.benchmarks.debtToEquity.good / result.ratios.debtToEquity) * 100), fullMark: 100 },
    { subject: 'EBITDA %', value: Math.min(100, (result.ratios.ebitdaMargin / result.benchmarks.ebitdaMargin.good) * 100), fullMark: 100 },
    { subject: 'Liquidity', value: Math.min(100, (result.ratios.currentRatio / result.benchmarks.currentRatio.good) * 100), fullMark: 100 },
  ];

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('AAA')) return 'text-emerald-600';
    if (rating.startsWith('AA')) return 'text-blue-600';
    if (rating.startsWith('A')) return 'text-cyan-600';
    if (rating.startsWith('BBB')) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 border border-line/10 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Estimated Rating</span>
            <TrendingUp className="w-4 h-4 opacity-30" />
          </div>
          <div className={`text-5xl font-bold ${getRatingColor(result.estimatedRating)}`}>
            {result.estimatedRating}
          </div>
          <p className="text-xs mt-2 opacity-60 italic font-serif">{RATING_DESCRIPTIONS[result.estimatedRating]}</p>
        </div>

        <div className="bg-white p-6 border border-line/10 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Target Rating</span>
            <Target className="w-4 h-4 opacity-30" />
          </div>
          <select
            value={targetRating}
            onChange={(e) => onTargetChange(e.target.value as CreditRating)}
            className={`text-5xl font-bold bg-transparent outline-none cursor-pointer ${getRatingColor(targetRating)}`}
          >
            {RATING_SCALE.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <p className="text-xs mt-2 opacity-60">Click to adjust target</p>
        </div>

        <div className="bg-white p-6 border border-line/10 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Rating Score</span>
            <div className="w-2 h-2 rounded-full bg-ink animate-pulse" />
          </div>
          <div className="text-5xl font-mono font-bold">
            {result.score}<span className="text-xl opacity-30">/100</span>
          </div>
          <div className="w-full bg-paper h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-ink h-full transition-all duration-1000" style={{ width: `${result.score}%` }} />
          </div>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 border border-line/10 rounded-xl shadow-sm h-[400px]">
          <h3 className="font-serif italic text-xl mb-6">Ratio Strength Analysis</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#141414" strokeOpacity={0.1} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600, fill: '#141414', fillOpacity: 0.6 }} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#141414"
                fill="#141414"
                fillOpacity={0.1}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 border border-line/10 rounded-xl shadow-sm">
          <h3 className="font-serif italic text-xl mb-6">Gap to Benchmark</h3>
          <div className="space-y-6">
            {[
              { label: 'Debt/EBITDA', current: result.ratios.debtToEbitda, target: result.benchmarks.debtToEbitda.good, inverse: true },
              { label: 'Interest Coverage', current: result.ratios.interestCoverage, target: result.benchmarks.interestCoverage.good },
              { label: 'Debt/Equity', current: result.ratios.debtToEquity, target: result.benchmarks.debtToEquity.good, inverse: true },
              { label: 'EBITDA Margin %', current: result.ratios.ebitdaMargin * 100, target: result.benchmarks.ebitdaMargin.good * 100 },
            ].map((item) => {
              const isGood = item.inverse ? item.current <= item.target : item.current >= item.target;
              return (
                <div key={item.label} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{item.label}</span>
                      <div className="font-mono text-lg font-bold">{item.current.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Benchmark</span>
                      <div className="font-mono text-sm opacity-60">{item.target.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-paper rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isGood ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (item.current / item.target) * 100)}%` }}
                      />
                    </div>
                    {isGood ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
