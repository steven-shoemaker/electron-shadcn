import React, { useState } from 'react';
import { Button } from "../ui/button";
import SimulationForm from './SimulationForm';
import SimulationDisplay from './SimulationDisplay';
import useSimulation from '../../hooks/useSimulation';
import { EventType } from '../../hooks/useSimulationConfig';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

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
    biases,
    handleGenerate,
    toggleTheme,
    handleSeasonalityChange,
    handleRateChange,
    handleBiasChange,
  } = useSimulation();

  const [isFormCollapsed, setIsFormCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4">
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Workforce Event Simulator
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormCollapsed(!isFormCollapsed)}
              className="md:hidden"
            >
              {isFormCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Simulation Form */}
          <div
            className={`
              transition-all duration-300
              ${isFormCollapsed ? 'w-0 md:w-0' : 'w-full md:w-96'}
              h-full overflow-hidden
              border-r border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-800
            `}
          >
            <div className="h-full w-96 overflow-y-auto">
              <SimulationForm
                dateRange={dateRange}
                setDateRange={setDateRange}
                seasonalities={seasonalities}
                eventRates={eventRates}
                biases={biases}
                isLoading={isLoading}
                error={error}
                theme={theme}
                handleGenerate={handleGenerate}
                toggleTheme={toggleTheme}
                handleSeasonalityChange={handleSeasonalityChange as (event: EventType, value: string) => void}
                handleRateChange={handleRateChange}
                handleBiasChange={handleBiasChange}
              />
            </div>
          </div>

          {/* Toggle Button for larger screens */}
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFormCollapsed(!isFormCollapsed)}
              className="h-12 w-6 rounded-none border-y-0 border-r border-gray-200 dark:border-gray-800"
            >
              {isFormCollapsed ? 
                <PanelLeftOpen className="h-4 w-4" /> : 
                <PanelLeftClose className="h-4 w-4" />
              }
            </Button>
          </div>

          {/* Simulation Display */}
          <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div className="h-full overflow-y-auto">
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
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
