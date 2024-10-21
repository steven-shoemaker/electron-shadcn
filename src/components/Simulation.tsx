import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EventChart from "@/components/EventChart";
import EventSummary from "@/components/EventSummary";
import { format, isAfter } from 'date-fns';
import { generateCustomEvents, EventData, EventRates, EmployeeEvent } from '@/lib/functions/eventGenerator';
import { SeasonalityFunction, noSeasonality, sineSeasonality, quarterlySeasonality, holidaySeasonality, summerSlumpSeasonality } from '@/lib/functions/seasonality';

import { Employee } from '@/lib/interfaces/Employee';
import { assignDemographics } from '@/lib/functions/demographicAssigner';
import { PieChartComponent, DemographicDataItem} from '@/components/charts/piechart';

const seasonalityOptions: { [key: string]: SeasonalityFunction } = {
    none: noSeasonality,
    sine: sineSeasonality(),
    quarterly: quarterlySeasonality,
    holiday: holidaySeasonality,
    summerSlump: summerSlumpSeasonality,
};

export default function SimulationComponent() {
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

  // State for event rates
  const [eventRates, setEventRates] = useState<EventRates>({
    hireRate: 0.1, // 10% annual hire rate
    voluntaryTerminationRate: 0.05, // 5% annual voluntary termination rate
    involuntaryTerminationRate: 0.02, // 2% annual involuntary termination rate
    promotionRate: 0.03, // 3% annual promotion rate
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

      // Assign demographics to employees after events are generated
      const genderCounts: { [key: string]: number } = {};
      const ethnicityCounts: { [key: string]: number } = {};
      const departmentCounts: { [key: string]: number } = {};

      const employeesWithDemographics = assignDemographics(employees);

      employeesWithDemographics.forEach((employee) => {
        // Gender
        genderCounts[employee.gender] = (genderCounts[employee.gender] || 0) + 1;
        // Ethnicity
        ethnicityCounts[employee.ethnicity] =
          (ethnicityCounts[employee.ethnicity] || 0) + 1;
        // Department
        departmentCounts[employee.department] =
          (departmentCounts[employee.department] || 0) + 1;
      });

      // Convert counts to DemographicDataItem arrays
      const totalEmployees = employeesWithDemographics.length;

      const genderData = Object.entries(genderCounts).map(([key, value]) => ({
        name: key,
        value: value,
        color: '', // Optional: Assign specific colors if desired
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

      // Update state
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

  // Handlers for event rates
  const handleRateChange = (field: keyof EventRates, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setEventRates(prev => ({ ...prev, [field]: num }));
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 h-full">
      {/* Side Panel */}
      <div className="w-full md:w-1/4 p-6 bg-white dark:bg-gray-800 overflow-y-auto max-h-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Event Simulation</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="start-date" className="block mb-2 text-gray-700 dark:text-gray-300">Start Date:</Label>
            <Input
              id="start-date"
              type="date"
              value={format(dateRange.start, 'yyyy-MM-dd')}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="end-date" className="block mb-2 text-gray-700 dark:text-gray-300">End Date:</Label>
            <Input
              id="end-date"
              type="date"
              value={format(dateRange.end, 'yyyy-MM-dd')}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Seasonality Selectors */}
          {['Hires', 'Terminations', 'Promotions'].map((event) => (
            <div key={event}>
              <Label htmlFor={`seasonality-${event}`} className="block mb-2 text-gray-700 dark:text-gray-300">
                {event} Seasonality:
              </Label>
              <Select
                onValueChange={(value) => handleSeasonalityChange(event, value)}
                defaultValue={seasonalities[event as keyof typeof seasonalities]}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${event} seasonality`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sine">Sine Wave</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="summerSlump">Summer Slump</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* Event Rates Configuration */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Configure Event Rates</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="hire-rate" className="block mb-1 text-gray-700 dark:text-gray-300">Annual Hire Rate (%):</Label>
                <Input
                  id="hire-rate"
                  type="number"
                  step="0.1"
                  value={(eventRates.hireRate * 100).toFixed(1)}
                  onChange={(e) => handleRateChange('hireRate', e.target.value)}
                  className="w-full"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="vol-term-rate" className="block mb-1 text-gray-700 dark:text-gray-300">Annual Voluntary Termination Rate (%):</Label>
                <Input
                  id="vol-term-rate"
                  type="number"
                  step="0.1"
                  value={(eventRates.voluntaryTerminationRate * 100).toFixed(1)}
                  onChange={(e) => handleRateChange('voluntaryTerminationRate', e.target.value)}
                  className="w-full"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="invol-term-rate" className="block mb-1 text-gray-700 dark:text-gray-300">Annual Involuntary Termination Rate (%):</Label>
                <Input
                  id="invol-term-rate"
                  type="number"
                  step="0.1"
                  value={(eventRates.involuntaryTerminationRate * 100).toFixed(1)}
                  onChange={(e) => handleRateChange('involuntaryTerminationRate', e.target.value)}
                  className="w-full"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="promotion-rate" className="block mb-1 text-gray-700 dark:text-gray-300">Annual Promotion Rate (%):</Label>
                <Input
                  id="promotion-rate"
                  type="number"
                  step="0.1"
                  value={(eventRates.promotionRate * 100).toFixed(1)}
                  onChange={(e) => handleRateChange('promotionRate', e.target.value)}
                  className="w-full"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleGenerate} variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Events'}
          </Button>

          <Button onClick={toggleTheme} variant="secondary" className="w-full mt-4">
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>

        {error && <div className="mt-4 text-red-500">{error}</div>}
      </div>

      {/* Main Chart Area */}
      <div className="flex-grow p-6 overflow-y-auto max-h-full">
        {eventData.length > 0 ? (
          <>
            <EventSummary data={eventData} employeeEvents={employeeEvents} employees={employees} theme={theme} />
            <EventChart data={eventData} theme={theme} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <PieChartComponent data={genderData} title="Gender Distribution" />
              <PieChartComponent data={ethnicityData} title="Ethnicity Distribution" />
              <PieChartComponent data={departmentData} title="Department Distribution" />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Click "Generate Events" to see the simulation results.
          </div>
        )}
      </div>
    </div>
  );
}