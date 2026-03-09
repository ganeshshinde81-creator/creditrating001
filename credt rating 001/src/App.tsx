
import React, { useState, useEffect } from 'react';
import { FinancialInput } from './components/FinancialInput';
import { RatingDashboard } from './components/RatingDashboard';
import { FinancialData, RatingResult, CreditRating } from './types';
import { estimateRating } from './services/ratingEngine';
import { getRatingInsights } from './services/geminiService';
import { LayoutDashboard, FileText, Sparkles, Loader2, ChevronRight, IndianRupee } from 'lucide-react';
import Markdown from 'react-markdown';

const INITIAL_DATA: FinancialData = {
  companyName: '',
  industry: 'Manufacturing',
  revenue: 1000,
  ebitda: 150,
  pat: 80,
  totalDebt: 400,
  interestExpense: 40,
  netWorth: 600,
  currentAssets: 300,
  currentLiabilities: 200,
  cashAndEquivalents: 50,
};

export default function App() {
  const [data, setData] = useState<FinancialData>(INITIAL_DATA);
  const [result, setResult] = useState<RatingResult | null>(null);
  const [targetRating, setTargetRating] = useState<CreditRating>('AAA');
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'dashboard' | 'insights'>('input');

  const handleAnalyze = async () => {
    setLoading(true);
    const ratingResult = estimateRating(data);
    setResult(ratingResult);
    setActiveTab('dashboard');
    
    try {
      const aiInsights = await getRatingInsights(data, ratingResult, targetRating);
      setInsights(aiInsights);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Rail */}
      <header className="border-b border-line/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
              <IndianRupee className="text-paper w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight">IndiRate</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'input', label: 'Financials', icon: FileText },
              { id: 'dashboard', label: 'Analysis', icon: LayoutDashboard },
              { id: 'insights', label: 'AI Strategy', icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-all ${
                  activeTab === tab.id ? 'opacity-100 border-b-2 border-ink pb-1' : 'opacity-40 hover:opacity-60'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="text-[10px] uppercase tracking-widest font-bold opacity-30 hidden sm:block">
            Corporate Credit Intelligence
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Quick Info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-ink text-paper p-6 rounded-2xl shadow-xl">
              <h2 className="font-serif italic text-2xl mb-4">Credit Gap Analysis</h2>
              <p className="text-sm opacity-70 leading-relaxed mb-6">
                Estimate credit ratings for Indian corporates based on standard agency benchmarks and identify strategic gaps.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase opacity-80">
                  <ChevronRight className="w-4 h-4" />
                  Ratio Benchmarking
                </div>
                <div className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase opacity-80">
                  <ChevronRight className="w-4 h-4" />
                  Industry Specifics
                </div>
                <div className="flex items-center gap-3 text-xs font-bold tracking-wider uppercase opacity-80">
                  <ChevronRight className="w-4 h-4" />
                  AI Recommendations
                </div>
              </div>
            </div>

            {result && (
              <div className="bg-white p-6 rounded-2xl border border-line/10 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 block mb-4">Summary View</span>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs opacity-60">Estimated</span>
                    <span className="font-bold">{result.estimatedRating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs opacity-60">Target</span>
                    <span className="font-bold">{targetRating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs opacity-60">Gap Score</span>
                    <span className="font-bold text-rose-500">-{Math.max(0, 100 - result.score)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {activeTab === 'input' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">Financial Disclosure</h2>
                  <span className="text-xs opacity-40 font-mono">FY 2024-25</span>
                </div>
                <FinancialInput 
                  data={data} 
                  onChange={setData} 
                  onAnalyze={handleAnalyze} 
                />
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {result ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-bold tracking-tight">Rating Dashboard</h2>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setActiveTab('insights')}
                          className="flex items-center gap-2 px-4 py-2 bg-ink text-paper text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-ink/90 transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          View AI Strategy
                        </button>
                        <button 
                          onClick={() => setActiveTab('input')}
                          className="text-xs uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity"
                        >
                          Edit Data
                        </button>
                      </div>
                    </div>
                    <RatingDashboard 
                      result={result} 
                      targetRating={targetRating} 
                      onTargetChange={setTargetRating} 
                    />
                  </>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 bg-white/50 rounded-2xl border-2 border-dashed border-line/10">
                    <LayoutDashboard className="w-12 h-12 opacity-10" />
                    <p className="opacity-40 font-serif italic text-xl">No analysis performed yet.</p>
                    <button onClick={() => setActiveTab('input')} className="text-xs uppercase tracking-widest font-bold underline">Enter Financials</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">AI Strategic Insights</h2>
                  <div className="flex items-center gap-4">
                    {result && (
                      <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-60 hover:opacity-100 disabled:opacity-20 transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        Refresh Strategy
                      </button>
                    )}
                    {loading && <Loader2 className="w-5 h-5 animate-spin opacity-40" />}
                  </div>
                </div>
                
                {insights ? (
                  <div className="bg-white p-8 rounded-2xl border border-line/10 shadow-sm prose prose-slate max-w-none markdown-body">
                    <Markdown>{insights}</Markdown>
                  </div>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 bg-white/50 rounded-2xl border-2 border-dashed border-line/10">
                    <Sparkles className="w-12 h-12 opacity-10" />
                    <p className="opacity-40 font-serif italic text-xl">
                      {loading ? "Generating strategic roadmap..." : "Run analysis to generate AI insights."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line/10 py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-40">
            <IndianRupee className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">IndiRate v1.0</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">
            © 2024 Financial Intelligence Systems
          </div>
        </div>
      </footer>
    </div>
  );
}
