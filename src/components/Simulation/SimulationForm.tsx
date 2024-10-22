import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Slider } from "../ui/slider";
import { format } from 'date-fns';
import { EventRates } from "../../lib/functions/eventGenerator";
import { EventType } from '../../hooks/useSimulationConfig';
import { ChevronRight, Calendar, Settings, Sliders, Users } from 'lucide-react';

interface SimulationFormProps {
  dateRange: { startDate: Date; endDate: Date };
  setDateRange: React.Dispatch<React.SetStateAction<{ startDate: Date; endDate: Date }>>;
  seasonalities: { [key: string]: string };
  eventRates: EventRates;
  biases: {
    [K in EventType]: {
      gender: { [key: string]: number };
      ethnicity: { [key: string]: number };
      department: { [key: string]: number };
    };
  };
  isLoading: boolean;
  error: string;
  theme: 'light' | 'dark';
  handleGenerate: () => void;
  toggleTheme: () => void;
  handleSeasonalityChange: (event: EventType, value: string) => void;
  handleRateChange: (field: keyof EventRates, value: string) => void;
  handleBiasChange: (event: EventType, demographic: 'gender' | 'ethnicity' | 'department', group: string, value: number) => void;
}

const presetConfigurations = {
  "Balanced": {
    biasLevel: "No Bias",
    seasonality: "none",
    rates: { hireRate: 0.15, terminationRate: 0.1, promotionRate: 0.08 }
  },
  "High Growth": {
    biasLevel: "Low",
    seasonality: "quarterly",
    rates: { hireRate: 0.25, terminationRate: 0.05, promotionRate: 0.12 }
  },
  "Cost Cutting": {
    biasLevel: "Medium",
    seasonality: "holiday",
    rates: { hireRate: 0.05, terminationRate: 0.15, promotionRate: 0.04 }
  }
};

export default function SimulationForm({
  dateRange,
  setDateRange,
  seasonalities,
  eventRates,
  biases,
  isLoading,
  error,
  theme,
  handleGenerate,
  toggleTheme,
  handleSeasonalityChange,
  handleRateChange,
  handleBiasChange,
}: SimulationFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const applyPreset = (presetName: string) => {
    const preset = presetConfigurations[presetName as keyof typeof presetConfigurations];
    setSelectedPreset(presetName);
    
    // Apply preset configurations
    Object.entries(preset.rates).forEach(([key, value]) => {
      handleRateChange(key as keyof EventRates, value.toString());
    });
    
    (['Hires', 'Terminations', 'Promotions'] as EventType[]).forEach(event => {
      handleSeasonalityChange(event, preset.seasonality);
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Workforce Event Simulator</CardTitle>
        <CardDescription>Configure your simulation parameters</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Basic Setup
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="biases" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Bias Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Choose a preset or customize your own</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                {Object.keys(presetConfigurations).map((preset) => (
                  <Button
                    key={preset}
                    variant={selectedPreset === preset ? "default" : "outline"}
                    className="w-full"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simulation Period</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-3 w-4 h-4 text-gray-500" />
                    <input
                      id="start-date"
                      type="date"
                      value={format(dateRange.startDate, 'yyyy-MM-dd')}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                      className="w-full pl-8 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-3 w-4 h-4 text-gray-500" />
                    <input
                      id="end-date"
                      type="date"
                      value={format(dateRange.endDate, 'yyyy-MM-dd')}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                      className="w-full pl-8 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Rates</CardTitle>
                <CardDescription>Set annual rates for each event type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(eventRates).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)} Rate</Label>
                      <span className="text-sm text-gray-500">{(value * 100).toFixed(1)}%</span>
                    </div>
                    <Slider
                      id={key}
                      min={0}
                      max={100}
                      step={0.1}
                      value={[value * 100]}
                      onValueChange={(vals) => handleRateChange(key as keyof EventRates, vals[0].toString())}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonality Patterns</CardTitle>
                <CardDescription>Configure seasonal variations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(['Hires', 'Terminations', 'Promotions'] as EventType[]).map((event) => (
                  <div key={event} className="space-y-2">
                    <Label htmlFor={`seasonality-${event}`}>{event}</Label>
                    <Select
                      onValueChange={(value: string) => handleSeasonalityChange(event, value)}
                      value={seasonalities[event]}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biases" className="space-y-4">
            {(['Hires', 'Terminations', 'Promotions'] as EventType[]).map((event) => (
              <Card key={event}>
                <CardHeader>
                  <CardTitle>{event} Bias Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  {['gender', 'ethnicity', 'department'].map((demographic) => (
                    <div key={`${event}-${demographic}`} className="mb-6">
                      <h5 className="text-md font-semibold mb-4">
                        {demographic.charAt(0).toUpperCase() + demographic.slice(1)} Bias Levels
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(biases[event][demographic as 'gender' | 'ethnicity' | 'department']).map(([group, value]) => (
                          <div key={group} className="space-y-2">
                            <div className="flex justify-between">
                              <Label>{group}</Label>
                              <span className="text-sm text-gray-500">
                                {value === 0 ? 'No Bias' : 
                                 value <= 0.3 ? 'Low' :
                                 value <= 0.6 ? 'Medium' : 'High'}
                              </span>
                            </div>
                            <Slider
                              min={0}
                              max={0.9}
                              step={0.3}
                              value={[value]}
                              onValueChange={(vals) => handleBiasChange(event, demographic as 'gender' | 'ethnicity' | 'department', group, vals[0])}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <Button onClick={handleGenerate} className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Simulation'}
          </Button>
          
          <Button onClick={toggleTheme} variant="outline" className="w-full">
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
      </CardContent>
    </div>
  );
}
