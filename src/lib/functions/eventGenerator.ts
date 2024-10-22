import { format, differenceInDays, addDays } from 'date-fns';
import { SeasonalityFunction } from './seasonality';
import { Employee } from '../interfaces/Employee';
import { getUniqueId } from './uniqueIdGenerator';

export interface EventData {
  date: string;
  Hires: number;
  Terminations: number;
  Promotions: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface SeasonalityFunctions {
  Hires: SeasonalityFunction;
  Terminations: SeasonalityFunction;
  Promotions: SeasonalityFunction;
}

export interface EventRates {
  hireRate: number; // Annual hire rate (e.g., 0.1 for 10%)
  voluntaryTerminationRate: number; // Annual voluntary termination rate
  involuntaryTerminationRate: number; // Annual involuntary termination rate
  promotionRate: number; // Annual promotion rate
}

export interface EmployeeEvent {
  date: string;
  type: 'hire' | 'termination' | 'promotion';
  employeeId: string;
}

interface GeneratedEvents {
  dailyEvents: EventData[];
  employeeEvents: EmployeeEvent[];
  employees: Employee[];
}

/**
 * Helper function to determine if an event occurs based on probability
 */
const eventOccursMultiple = (prob: number, trials: number): number => {
  let count = 0;
  for (let t = 0; t < trials; t++) {
    if (Math.random() < prob) count++;
  }
  return count;
};

/**
 * Generates custom employee events between startDate and endDate.
 * Assigns unique IDs to hires and ties terminations/promotions to these IDs.
 */
export function generateCustomEvents(
  dateRange: DateRange,
  seasonalityFns: SeasonalityFunctions,
  eventRates: EventRates
): GeneratedEvents {
  const { startDate, endDate } = dateRange;
  const dailyEvents: EventData[] = [];
  const employeeEvents: EmployeeEvent[] = [];
  const employees: Employee[] = [];

  const dayCount = differenceInDays(endDate, startDate);
  const daysInYear = 365;

  // Calculate daily rates based on annual rates
  const dailyHireRate = 1 - Math.pow(1 - eventRates.hireRate, 1 / daysInYear);
  const dailyVolTerminationRate = 1 - Math.pow(1 - eventRates.voluntaryTerminationRate, 1 / daysInYear);
  const dailyInvolTerminationRate = 1 - Math.pow(1 - eventRates.involuntaryTerminationRate, 1 / daysInYear);
  const dailyPromotionRate = 1 - Math.pow(1 - eventRates.promotionRate, 1 / daysInYear);

  // Initialize active employees list
  const activeEmployees: Employee[] = [];

  for (let i = 0; i <= dayCount; i++) {
    const currentDate = addDays(startDate, i);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    // Adjust rates based on seasonality
    const adjustedHireRate = dailyHireRate * seasonalityFns.Hires(currentDate);
    const adjustedVolTerminationRate = dailyVolTerminationRate * seasonalityFns.Terminations(currentDate);
    const adjustedInvolTerminationRate = dailyInvolTerminationRate * seasonalityFns.Terminations(currentDate);
    const adjustedPromotionRate = dailyPromotionRate * seasonalityFns.Promotions(currentDate);

    // Determine number of hires, terminations, and promotions for the day
    const hiresCount = eventOccursMultiple(adjustedHireRate, 1000); // Up to 1000 hires per day
    const voluntTerminationsCount = eventOccursMultiple(adjustedVolTerminationRate, 1000); // Up to 1000 voluntary terminations
    const involTerminationsCount = eventOccursMultiple(adjustedInvolTerminationRate, 1000); // Up to 1000 involuntary terminations
    const promotionsCount = eventOccursMultiple(adjustedPromotionRate, 1000); // Up to 1000 promotions per day

    let terminationsToday = 0;
    let promotionsToday = 0;

    // Process Hires
    for (let h = 0; h < hiresCount; h++) {
      const newEmployee: Employee = {
        id: getUniqueId(),
        hireDate: formattedDate,
        promotionDates: [],
      };
      activeEmployees.push(newEmployee);
      employees.push(newEmployee);
      employeeEvents.push({
        date: formattedDate,
        type: 'hire',
        employeeId: newEmployee.id,
      });
    }

    // Process Voluntary Terminations
    for (let v = 0; v < voluntTerminationsCount; v++) {
      if (activeEmployees.length === 0) break;
      const randomIndex = Math.floor(Math.random() * activeEmployees.length);
      const employee = activeEmployees[randomIndex];
      employee.terminationDate = formattedDate;
      employeeEvents.push({
        date: formattedDate,
        type: 'termination',
        employeeId: employee.id,
      });
      // Remove from active employees
      activeEmployees.splice(randomIndex, 1);
      terminationsToday++;
    }

    // Process Involuntary Terminations
    for (let iv = 0; iv < involTerminationsCount; iv++) {
      if (activeEmployees.length === 0) break;
      const randomIndex = Math.floor(Math.random() * activeEmployees.length);
      const employee = activeEmployees[randomIndex];
      employee.terminationDate = formattedDate;
      employeeEvents.push({
        date: formattedDate,
        type: 'termination',
        employeeId: employee.id,
      });
      // Remove from active employees
      activeEmployees.splice(randomIndex, 1);
      terminationsToday++;
    }

    // Process Promotions
    for (let p = 0; p < promotionsCount; p++) {
      if (activeEmployees.length === 0) break;
      const randomIndex = Math.floor(Math.random() * activeEmployees.length);
      const employee = activeEmployees[randomIndex];
      // Ensure the employee hasn't been promoted today already
      if (!employee.promotionDates.includes(formattedDate)) {
        employee.promotionDates.push(formattedDate);
        employeeEvents.push({
          date: formattedDate,
          type: 'promotion',
          employeeId: employee.id,
        });
        promotionsToday++;
      }
    }

    // Aggregate daily events
    dailyEvents.push({
      date: formattedDate,
      Hires: hiresCount,
      Terminations: terminationsToday + involTerminationsCount,
      Promotions: promotionsToday,
    });
  }

  return  {
    dailyEvents,
    employeeEvents,
    employees,
  };
}