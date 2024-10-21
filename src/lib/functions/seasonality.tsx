import { getMonth } from 'date-fns';

export interface SeasonalityFunction {
  (date: Date): number;
}

export const noSeasonality: SeasonalityFunction = () => 1;

export const sineSeasonality = (amplitude: number = 0.2): SeasonalityFunction => {
  return (date: Date) => {
    const month = getMonth(date);
    return 1 + amplitude * Math.sin((month / 11) * Math.PI * 2);
  };
};

export const quarterlySeasonality: SeasonalityFunction = (date: Date) => {
  const month = getMonth(date);
  const quarterPeak = [1.2, 0.9, 1.1, 1.3];
  return quarterPeak[Math.floor(month / 3)];
};

export const holidaySeasonality: SeasonalityFunction = (date: Date) => {
  const month = getMonth(date);
  return month === 11 ? 1.5 : 1; // December boost
};

export const summerSlumpSeasonality: SeasonalityFunction = (date: Date) => {
  const month = getMonth(date);
  return month >= 5 && month <= 7 ? 0.8 : 1; // June-August slump
};