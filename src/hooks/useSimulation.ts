import { useState, useCallback } from 'react';
import { isAfter } from 'date-fns';
import { generateCustomEvents, EventData, EventRates, EmployeeEvent } from '@/lib/functions/eventGenerator';
import { SeasonalityFunction, noSeasonality, sineSeasonality, quarterlySeasonality, holidaySeasonality, summerSlumpSeasonality } from '@/lib/functions/seasonality';
import { Employee } from '@/lib/interfaces/Employee';
import { assignDemographics } from '@/lib/functions/demographicAssigner';
import { DemographicDataItem } from '@/components/charts/piechart';

const seasonalityOptions: { [key: string]: SeasonalityFunction } = {
  none: noSeasonality,
  sine: sineSeasonality(),
  quarterly: quarterlySeasonality,
  holiday: holidaySeasonality,
  summerSlump: summerSlumpSeasonality,
};

export default function useSimulation() {
  const [dateRange, setDateRange] = useState({
    start: new Date('2018-01-01'),
    end: new Date('2028-12-31'),
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
  const [seasonalities, setSeasonalities] = useState({
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

  const handleGenerate = useCallback(async () => {
    if (isAfter(dateRange.start, dateRange.end)) {
      setError('Start date cannot be after end date.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const seasonalityFunctions = {
        Hires: seasonalityOptions[seasonalities.Hires],
        Terminations: seasonalityOptions[seasonalities.Terminations],
        Promotions: seasonalityOptions[seasonalities.Promotions],
      };
      const { dailyEvents, employeeEvents, employees } = generateCustomEvents(
        dateRange.start,
        dateRange.end,
        seasonalityFunctions,
        eventRates
      );

      const genderCounts: { [key: string]: number } = {};
      const ethnicityCounts: { [key: string]: number } = {};
      const departmentCounts: { [key: string]: number } = {};

      const employeesWithDemographics = assignDemographics(employees);

      employeesWithDemographics.forEach((employee) => {
        genderCounts[employee.gender] = (genderCounts[employee.gender] || 0) + 1;
        ethnicityCounts[employee.ethnicity] = (ethnicityCounts[employee.ethnicity] || 0) + 1;
        departmentCounts[employee.department] = (departmentCounts[employee.department] || 0) + 1;
      });

      const genderData = Object.entries(genderCounts).map(([key, value]) => ({
        name: key,
        value: value,
        color: '',
      }));

      const ethnicityData = Object.entries(ethnicityCounts).map(([key, value]) => ({
        name: key,
        value: value,
        color: '',
      }));

      const departmentData = Object.entries(departmentCounts).map(([key, value]) => ({
        name: key,
        value: value,
        color: '',
      }));

      setGenderData(genderData);
      setEthnicityData(ethnicityData);
      setDepartmentData(departmentData);
      setEventData(dailyEvents);
      setEmployeeEvents(employeeEvents);
      setEmployees(employeesWithDemographics);
    } catch (err) {
      setError('An error occurred while generating events.');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, seasonalities, eventRates]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    document.documentElement.classList.toggle('dark');
  };

  const handleSeasonalityChange = (event: string, value: string) => {
    setSeasonalities(prev => ({ ...prev, [event]: value }));
  };

  const handleRateChange = (field: keyof EventRates, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setEventRates(prev => ({ ...prev, [field]: num / 100 }));
    }
  };

  return {
    dateRange,
    setDateRange,
    eventData,
    employeeEvents,
    employees,
    genderData,
    ethnicityData,
    departmentData,
    theme,
    isLoading,
    error,
    seasonalities,
    eventRates,
    handleGenerate,
    toggleTheme,
    handleSeasonalityChange,
    handleRateChange,
  };
}
