import { useSimulationState } from './useSimulationState';
import { useSimulationConfig, EventType } from './useSimulationConfig';
import { useSimulationProcessing } from './useSimulationProcessing';
import { SeasonalityFunction, noSeasonality, sineSeasonality, quarterlySeasonality, holidaySeasonality, summerSlumpSeasonality } from '../lib/functions/seasonality';
import { EventRates } from '../lib/functions/eventGenerator';

const seasonalityOptions: Record<string, SeasonalityFunction> = {
  none: noSeasonality,
  sine: sineSeasonality(),
  quarterly: quarterlySeasonality,
  holiday: holidaySeasonality,
  summerSlump: summerSlumpSeasonality,
};

export default function useSimulation() {
  const {
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
  } = useSimulationState();

  const {
    biases,
    handleSeasonalityChange: configHandleSeasonalityChange,
    handleRateChange: configHandleRateChange,
    handleBiasChange,
  } = useSimulationConfig();

  const selectedSeasonalities = {
    Hires: seasonalityOptions[seasonalities.Hires],
    Terminations: seasonalityOptions[seasonalities.Terminations],
    Promotions: seasonalityOptions[seasonalities.Promotions],
  };

  const { handleGenerate } = useSimulationProcessing(
    dateRange,
    selectedSeasonalities,
    eventRates,
    biases,
    setEventData,
    setEmployeeEvents,
    setEmployees,
    setGenderData,
    setEthnicityData,
    setDepartmentData,
    setIsLoading,
    setError
  );

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    document.documentElement.classList.toggle('dark');
  };

  const handleSeasonalityChange = (event: EventType, value: string) => {
    configHandleSeasonalityChange(event, value);
    setSeasonalities(prev => ({ ...prev, [event]: value }));
  };

  const handleRateChange = (field: keyof EventRates, value: string) => {
    configHandleRateChange(field, value);
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
    biases,
    handleGenerate,
    toggleTheme,
    handleSeasonalityChange,
    handleRateChange,
    handleBiasChange,
  };
}
