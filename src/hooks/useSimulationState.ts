import { useState } from 'react';
import { EventData, EmployeeEvent, DateRange, EventRates } from '@/lib/functions/eventGenerator';
import { Employee } from '@/lib/interfaces/Employee';
import { DemographicDataItem } from '@/components/charts/piechart';

const eventTypes = ['Hires', 'Terminations', 'Promotions'] as const;
type EventType = typeof eventTypes[number];

export function useSimulationState() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date('2018-01-01'),
    endDate: new Date('2028-12-31'),
  });
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [employeeEvents, setEmployeeEvents] = useState<EmployeeEvent[]>([]);
  const [genderData, setGenderData] = useState<DemographicDataItem[]>([]);
  const [ethnicityData, setEthnicityData] = useState<DemographicDataItem[]>([]);
  const [departmentData, setDepartmentData] = useState<DemographicDataItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [seasonalities, setSeasonalities] = useState<{[key in EventType]: string}>({
    Hires: 'sine',
    Terminations: 'quarterly',
    Promotions: 'holiday',
  });
  const [eventRates, setEventRates] = useState<EventRates>({
    hireRate: 0.1,
    voluntaryTerminationRate: 0.05,
    involuntaryTerminationRate: 0.02,
    promotionRate: 0.03,
  });

  return {
    dateRange,
    setDateRange,
    eventData,
    setEventData,
    employeeEvents,
    setEmployeeEvents,
    genderData,
    setGenderData,
    ethnicityData,
    setEthnicityData,
    departmentData,
    setDepartmentData,
    employees,
    setEmployees,
    theme,
    setTheme,
    isLoading,
    setIsLoading,
    error,
    setError,
    seasonalities,
    setSeasonalities,
    eventRates,
    setEventRates,
  };
}
