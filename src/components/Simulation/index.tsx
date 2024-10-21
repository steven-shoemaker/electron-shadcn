import React from 'react';
import SimulationForm from './SimulationForm';
import SimulationDisplay from './SimulationDisplay';
import useSimulation from '@/hooks/useSimulation';

export default function SimulationComponent() {
  const {
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
  } = useSimulation();

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900 h-full">
      <SimulationForm
        dateRange={dateRange}
        setDateRange={setDateRange}
        seasonalities={seasonalities}
        eventRates={eventRates}
        isLoading={isLoading}
        error={error}
        theme={theme}
        handleGenerate={handleGenerate}
        toggleTheme={toggleTheme}
        handleSeasonalityChange={handleSeasonalityChange}
        handleRateChange={handleRateChange}
      />
      <SimulationDisplay
        eventData={eventData}
        employeeEvents={employeeEvents}
        employees={employees}
        genderData={genderData}
        ethnicityData={ethnicityData}
        departmentData={departmentData}
        theme={theme}
      />
    </div>
  );
}
