// event_generator.tsx
import { SimulationConfig } from './config';
import { applyBiasAndFactors } from './bias';
import { applySeasonality } from './seasonality';

export interface EmployeeEvent {
  type: 'hire' | 'termination' | 'promotion';
  date: Date;
  employeeId: number;
}

export function generateEvents(config: SimulationConfig): EmployeeEvent[] {
  const events: EmployeeEvent[] = [];
  let currentEmployeeCount = config.initialEmployeeCount;
  let currentDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  let employeeId = 1;

  while (currentDate <= endDate) {
    const monthlyGrowthRate = Math.pow(1 + config.growthRate / 100, 1 / 12) - 1;
    const expectedHires = Math.max(0, currentEmployeeCount * monthlyGrowthRate);
    const expectedTerminations = currentEmployeeCount * 0.02; // 2% monthly turnover rate
    const expectedPromotions = currentEmployeeCount * 0.01; // 1% monthly promotion rate

    const actualHires = applyBiasAndFactors(applySeasonality(expectedHires, currentDate, 'hire'), config);
    const actualTerminations = applyBiasAndFactors(applySeasonality(expectedTerminations, currentDate, 'termination'), config);
    const actualPromotions = applyBiasAndFactors(applySeasonality(expectedPromotions, currentDate, 'promotion'), config);

    for (let i = 0; i < Math.round(actualHires); i++) {
      events.push({ type: 'hire', date: new Date(currentDate), employeeId: employeeId++ });
    }

    for (let i = 0; i < Math.round(actualTerminations); i++) {
      if (currentEmployeeCount > 0) {
        events.push({ type: 'termination', date: new Date(currentDate), employeeId: Math.floor(Math.random() * currentEmployeeCount) + 1 });
      }
    }

    for (let i = 0; i < Math.round(actualPromotions); i++) {
      if (currentEmployeeCount > 0) {
        events.push({ type: 'promotion', date: new Date(currentDate), employeeId: Math.floor(Math.random() * currentEmployeeCount) + 1 });
      }
    }

    currentEmployeeCount += actualHires - actualTerminations;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return events;
}