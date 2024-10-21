import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { EventRates } from '@/lib/functions/eventGenerator';

interface SimulationFormProps {
  dateRange: { start: Date; end: Date };
  setDateRange: React.Dispatch<React.SetStateAction<{ start: Date; end: Date }>>;
  seasonalities: { [key: string]: string };
  eventRates: EventRates;
  isLoading: boolean;
  error: string;
  theme: 'light' | 'dark';
  handleGenerate: () => void;
  toggleTheme: () => void;
  handleSeasonalityChange: (event: string, value: string) => void;
  handleRateChange: (field: keyof EventRates, value: string) => void;
}

export default function SimulationForm({
  dateRange,
  setDateRange,
  seasonalities,
  eventRates,
  isLoading,
  error,
  theme,
  handleGenerate,
  toggleTheme,
  handleSeasonalityChange,
  handleRateChange,
}: SimulationFormProps) {
  return (
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

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Configure Event Rates</h3>
          <div className="space-y-3">
            {Object.entries(eventRates).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key} className="block mb-1 text-gray-700 dark:text-gray-300">
                  Annual {key.charAt(0).toUpperCase() + key.slice(1)} Rate (%):
                </Label>
                <Input
                  id={key}
                  type="number"
                  step="0.1"
                  value={(value * 100).toFixed(1)}
                  onChange={(e) => handleRateChange(key as keyof EventRates, e.target.value)}
                  className="w-full"
                  min="0"
                  max="100"
                />
              </div>
            ))}
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
  );
}
