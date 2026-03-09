
import React from 'react';
import { FinancialData } from '../types';
import { INDUSTRY_BENCHMARKS } from '../constants';

interface Props {
  data: FinancialData;
  onChange: (data: FinancialData) => void;
  onAnalyze: () => void;
}

export const FinancialInput: React.FC<Props> = ({ data, onChange, onAnalyze }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: name === 'companyName' || name === 'industry' ? value : parseFloat(value) || 0,
    });
  };

  return (
    <div className="space-y-6 bg-white/50 p-6 border border-line/10 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold opacity-50">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={data.companyName}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-line/20 py-2 focus:border-line outline-none transition-colors"
            placeholder="e.g. Tata Motors"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold opacity-50">Industry</label>
          <select
            name="industry"
            value={data.industry}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-line/20 py-2 focus:border-line outline-none transition-colors"
          >
            {Object.keys(INDUSTRY_BENCHMARKS).map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Revenue (Cr)', name: 'revenue' },
          { label: 'EBITDA (Cr)', name: 'ebitda' },
          { label: 'PAT (Cr)', name: 'pat' },
          { label: 'Total Debt (Cr)', name: 'totalDebt' },
          { label: 'Interest Exp (Cr)', name: 'interestExpense' },
          { label: 'Net Worth (Cr)', name: 'netWorth' },
          { label: 'Current Assets (Cr)', name: 'currentAssets' },
          { label: 'Current Liab (Cr)', name: 'currentLiabilities' },
          { label: 'Cash & Equiv (Cr)', name: 'cashAndEquivalents' },
        ].map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-semibold opacity-50">{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={(data as any)[field.name]}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-line/20 py-1 font-mono focus:border-line outline-none transition-colors"
            />
          </div>
        ))}
      </div>

      <button
        onClick={onAnalyze}
        className="w-full mt-4 py-4 bg-ink text-paper uppercase tracking-[0.2em] font-bold hover:bg-ink/90 transition-all active:scale-[0.98]"
      >
        Run Gap Analysis
      </button>
    </div>
  );
};
