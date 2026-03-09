
import { CreditRating } from './types';

export const RATING_SCALE: CreditRating[] = [
  'AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BBB-', 'BB+', 'BB', 'B', 'C', 'D'
];

export const RATING_DESCRIPTIONS: Record<CreditRating, string> = {
  'AAA': 'Highest Safety',
  'AA+': 'High Safety',
  'AA': 'High Safety',
  'AA-': 'High Safety',
  'A+': 'Adequate Safety',
  'A': 'Adequate Safety',
  'A-': 'Adequate Safety',
  'BBB+': 'Moderate Safety',
  'BBB': 'Moderate Safety',
  'BBB-': 'Moderate Safety',
  'BB+': 'Moderate Risk',
  'BB': 'Moderate Risk',
  'B': 'High Risk',
  'C': 'Very High Risk',
  'D': 'Default',
};

export const INDUSTRY_BENCHMARKS = {
  Manufacturing: {
    debtToEbitda: { good: 1.5, average: 3.0 },
    interestCoverage: { good: 4.0, average: 2.5 },
    debtToEquity: { good: 0.5, average: 1.0 },
    ebitdaMargin: { good: 0.15, average: 0.10 },
    currentRatio: { good: 1.5, average: 1.2 },
  },
  Services: {
    debtToEbitda: { good: 1.0, average: 2.0 },
    interestCoverage: { good: 6.0, average: 4.0 },
    debtToEquity: { good: 0.3, average: 0.7 },
    ebitdaMargin: { good: 0.25, average: 0.15 },
    currentRatio: { good: 1.3, average: 1.1 },
  },
  Infrastructure: {
    debtToEbitda: { good: 3.0, average: 5.0 },
    interestCoverage: { good: 2.5, average: 1.8 },
    debtToEquity: { good: 1.5, average: 2.5 },
    ebitdaMargin: { good: 0.30, average: 0.20 },
    currentRatio: { good: 1.2, average: 1.0 },
  }
};
