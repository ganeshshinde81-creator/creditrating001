
import { FinancialData, FinancialRatios, RatingResult, CreditRating } from '../types';
import { INDUSTRY_BENCHMARKS, RATING_SCALE } from '../constants';

export function calculateRatios(data: FinancialData): FinancialRatios {
  return {
    debtToEbitda: data.ebitda > 0 ? data.totalDebt / data.ebitda : 99,
    interestCoverage: data.interestExpense > 0 ? data.ebitda / data.interestExpense : 99,
    debtToEquity: data.netWorth > 0 ? data.totalDebt / data.netWorth : 99,
    ebitdaMargin: data.revenue > 0 ? data.ebitda / data.revenue : 0,
    currentRatio: data.currentLiabilities > 0 ? data.currentAssets / data.currentLiabilities : 0,
    netWorth: data.netWorth,
  };
}

export function estimateRating(data: FinancialData): RatingResult {
  const ratios = calculateRatios(data);
  const industry = data.industry as keyof typeof INDUSTRY_BENCHMARKS || 'Manufacturing';
  const benchmarks = INDUSTRY_BENCHMARKS[industry];

  let score = 0;

  // Simple scoring logic based on benchmarks
  // Lower is better for debt ratios, higher for coverage/margin
  if (ratios.debtToEbitda <= benchmarks.debtToEbitda.good) score += 25;
  else if (ratios.debtToEbitda <= benchmarks.debtToEbitda.average) score += 15;
  else score += 5;

  if (ratios.interestCoverage >= benchmarks.interestCoverage.good) score += 25;
  else if (ratios.interestCoverage >= benchmarks.interestCoverage.average) score += 15;
  else score += 5;

  if (ratios.debtToEquity <= benchmarks.debtToEquity.good) score += 20;
  else if (ratios.debtToEquity <= benchmarks.debtToEquity.average) score += 12;
  else score += 4;

  if (ratios.ebitdaMargin >= benchmarks.ebitdaMargin.good) score += 15;
  else if (ratios.ebitdaMargin >= benchmarks.ebitdaMargin.average) score += 10;
  else score += 5;

  if (ratios.currentRatio >= benchmarks.currentRatio.good) score += 15;
  else if (ratios.currentRatio >= benchmarks.currentRatio.average) score += 10;
  else score += 5;

  // Map score (max 100) to rating
  let estimatedRating: CreditRating = 'D';
  if (score >= 90) estimatedRating = 'AAA';
  else if (score >= 85) estimatedRating = 'AA+';
  else if (score >= 80) estimatedRating = 'AA';
  else if (score >= 75) estimatedRating = 'AA-';
  else if (score >= 70) estimatedRating = 'A+';
  else if (score >= 65) estimatedRating = 'A';
  else if (score >= 60) estimatedRating = 'A-';
  else if (score >= 55) estimatedRating = 'BBB+';
  else if (score >= 50) estimatedRating = 'BBB';
  else if (score >= 45) estimatedRating = 'BBB-';
  else if (score >= 35) estimatedRating = 'BB+';
  else if (score >= 25) estimatedRating = 'BB';
  else if (score >= 15) estimatedRating = 'B';
  else if (score >= 5) estimatedRating = 'C';

  return {
    estimatedRating,
    score,
    ratios,
    benchmarks: benchmarks as any
  };
}
