
export type CreditRating = 'AAA' | 'AA+' | 'AA' | 'AA-' | 'A+' | 'A' | 'A-' | 'BBB+' | 'BBB' | 'BBB-' | 'BB+' | 'BB' | 'B' | 'C' | 'D';

export interface FinancialData {
  companyName: string;
  industry: string;
  revenue: number;
  ebitda: number;
  pat: number;
  totalDebt: number;
  interestExpense: number;
  netWorth: number;
  currentAssets: number;
  currentLiabilities: number;
  cashAndEquivalents: number;
}

export interface FinancialRatios {
  debtToEbitda: number;
  interestCoverage: number;
  debtToEquity: number;
  ebitdaMargin: number;
  currentRatio: number;
  netWorth: number;
}

export interface RatingResult {
  estimatedRating: CreditRating;
  score: number;
  ratios: FinancialRatios;
  benchmarks: Record<string, { good: number; average: number }>;
}
