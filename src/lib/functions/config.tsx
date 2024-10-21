import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export interface SeasonalityPattern {
  type: string;
  values: number[] | { startDate: string; endDate: string; factor: number }[];
}

export interface BiasParameter {
  field: string;
  type: string;
  time_varying: boolean;
  params: Record<string, any>;
}

export interface SimulationConfig {
  startDate: string;
  endDate: string;
  initialEmployeeCount: number;
  annualGrowthRate: number;
  yearsBeforeStart: number;
  targetVoluntaryTerminationRate: number;
  targetInvoluntaryTerminationRate: number;
  targetHireRate: number;
  employeeIdCounter: number;
  seasonality: SeasonalityPattern[];
  biasConfig: BiasParameter[];
}

export default function ConfigurationComponent({ onConfigSubmit }: { onConfigSubmit: (config: SimulationConfig) => void }) {
  const [config, setConfig] = useState<SimulationConfig>({
    startDate: '2018-01-01',
    endDate: '2028-12-31',
    initialEmployeeCount: 5000,
    annualGrowthRate: 0.07,
    yearsBeforeStart: 10,
    targetVoluntaryTerminationRate: 0.08,
    targetInvoluntaryTerminationRate: 0.02,
    targetHireRate: 0.22,
    employeeIdCounter: 5000,
    seasonality: [
      {
        type: 'hire',
        values: [0.05, 0.08, 0.12, 0.15, 0.10, 0.08, 0.05, 0.07, 0.10, 0.12, 0.05, 0.03],
      },
      {
        type: 'voluntary_termination',
        values: [1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2],
      },
      {
        type: 'involuntary_termination',
        values: [0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 0.8, 0.9, 1.0, 1.1, 1.0],
      },
      {
        type: 'promotion',
        values: [0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.7],
      },
      {
        type: 'multi_year_hire',
        values: [
          { startDate: '2018-01-01', endDate: '2019-12-31', factor: 1.0 },
          { startDate: '2020-01-01', endDate: '2020-12-31', factor: 0.5 },
          { startDate: '2021-01-01', endDate: '2021-06-30', factor: 0.8 },
          { startDate: '2021-07-01', endDate: '2021-12-31', factor: 1.2 },
          { startDate: '2022-01-01', endDate: '2028-12-31', factor: 1.0 },
        ],
      },
    ],
    biasConfig: [
      {
        field: 'gender',
        type: 'categorical',
        time_varying: true,
        params: {
          categories: ['Male', 'Female'],
          probabilities: [0.6, 0.4],
          referenceDate: '2018-01-01',
          timeVaryingFactor: 0.01,
        },
      },
      {
        field: 'age',
        type: 'numerical',
        time_varying: true,
        params: {
          mean: 31,
          std: 10,
          min: 22,
          max: 65,
          referenceDate: '2018-01-01',
          timeVaryingFactor: 0.005,
        },
      },
      {
        field: 'department',
        type: 'categorical',
        time_varying: false,
        params: {
          categories: ['Sales', 'Engineering', 'HR', 'Marketing', 'Finance'],
          probabilities: [0.3, 0.3, 0.15, 0.15, 0.1],
        },
      },
      {
        field: 'ethnicity',
        type: 'categorical',
        time_varying: true,
        params: {
          categories: ['White', 'Black', 'Asian', 'Hispanic', 'Other'],
          probabilities: [0.6, 0.12, 0.12, 0.12, 0.04],
          referenceDate: '2018-01-01',
          timeVaryingFactor: 0.005,
        },
      },
      {
        field: 'promotion',
        type: 'probability',
        time_varying: true,
        params: {
          baseProbability: 0.05,
          conditionWeights: {
            'gender=Male': 1.2,
            'age=30-50': 1.3,
            'ethnicity=White': 1.1,
            'ethnicity=Asian': 1.1,
          },
          referenceDate: '2018-01-01',
          timeVaryingFactor: 0.01,
        },
      },
      {
        field: 'termination',
        type: 'probability',
        time_varying: true,
        params: {
          baseProbability: 0.10, // 0.08 + 0.02
          conditionWeights: {
            'age<30': 4.0,
            'age>=30&age<=50': 0.8,
            'age>50': 3.5,
            'gender=Female': 1.1,
            'ethnicity=Black': 1.2,
            'ethnicity=Hispanic': 1.2,
          },
          referenceDate: '2018-01-01',
          timeVaryingFactor: 0.005,
        },
      },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value;
    setConfig(prevConfig => ({ ...prevConfig, [name]: newValue }));
  };

  const handleSeasonalityChange = (index: number, key: string, value: any) => {
    const updatedSeasonality = [...config.seasonality];
    // @ts-ignore
    updatedSeasonality[index][key] = value;
    setConfig(prevConfig => ({ ...prevConfig, seasonality: updatedSeasonality }));
  };

  const handleBiasConfigChange = (index: number, key: string, value: any) => {
    const updatedBiasConfig = [...config.biasConfig];
    // @ts-ignore
    updatedBiasConfig[index][key] = value;
    setConfig(prevConfig => ({ ...prevConfig, biasConfig: updatedBiasConfig }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigSubmit(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Configuration */}
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={config.startDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={config.endDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="initialEmployeeCount">Initial Employee Count</Label>
        <Input
          id="initialEmployeeCount"
          name="initialEmployeeCount"
          type="number"
          value={config.initialEmployeeCount}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualGrowthRate">Annual Growth Rate (%)</Label>
        <Slider
          id="annualGrowthRate"
          min={-10}
          max={20}
          step={0.1}
          value={[config.annualGrowthRate * 100]}
          onValueChange={(value) => setConfig(prev => ({ ...prev, annualGrowthRate: value[0] / 100 }))}
        />
        <span>{(config.annualGrowthRate * 100).toFixed(1)}%</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="yearsBeforeStart">Years Before Start</Label>
        <Input
          id="yearsBeforeStart"
          name="yearsBeforeStart"
          type="number"
          value={config.yearsBeforeStart}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Termination Rates */}
      <div className="space-y-2">
        <Label htmlFor="targetVoluntaryTerminationRate">Target Voluntary Termination Rate (%)</Label>
        <Slider
          id="targetVoluntaryTerminationRate"
          min={0}
          max={100}
          step={0.1}
          value={[config.targetVoluntaryTerminationRate * 100]}
          onValueChange={(value) => setConfig(prev => ({ ...prev, targetVoluntaryTerminationRate: value[0] / 100 }))}
        />
        <span>{(config.targetVoluntaryTerminationRate * 100).toFixed(1)}%</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetInvoluntaryTerminationRate">Target Involuntary Termination Rate (%)</Label>
        <Slider
          id="targetInvoluntaryTerminationRate"
          min={0}
          max={100}
          step={0.1}
          value={[config.targetInvoluntaryTerminationRate * 100]}
          onValueChange={(value) => setConfig(prev => ({ ...prev, targetInvoluntaryTerminationRate: value[0] / 100 }))}
        />
        <span>{(config.targetInvoluntaryTerminationRate * 100).toFixed(1)}%</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetHireRate">Target Hire Rate (%)</Label>
        <Slider
          id="targetHireRate"
          min={0}
          max={100}
          step={0.1}
          value={[config.targetHireRate * 100]}
          onValueChange={(value) => setConfig(prev => ({ ...prev, targetHireRate: value[0] / 100 }))}
        />
        <span>{(config.targetHireRate * 100).toFixed(1)}%</span>
      </div>

      {/* Employee ID Counter */}
      <div className="space-y-2">
        <Label htmlFor="employeeIdCounter">Employee ID Counter</Label>
        <Input
          id="employeeIdCounter"
          name="employeeIdCounter"
          type="number"
          value={config.employeeIdCounter}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Seasonality Configuration */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Seasonality Configuration</h2>
        {config.seasonality.map((season, index) => (
          <div key={index} className="border p-4 rounded">
            <Label>Type</Label>
            <Input
              type="text"
              value={season.type}
              onChange={(e) => handleSeasonalityChange(index, 'type', e.target.value)}
              required
            />
            {/* Handle different seasonality types */}
            {season.type === 'multi_year_hire' ? (
              <div className="space-y-2 mt-2">
                <Label>Multi-Year Hire Patterns</Label>
                {season.values.map((pattern: any, patIndex: number) => (
                  <div key={patIndex} className="flex space-x-2">
                    <Input
                      type="date"
                      value={pattern.startDate}
                      onChange={(e) => {
                        const newPatterns = [...season.values];
                        newPatterns[patIndex].startDate = e.target.value;
                        handleSeasonalityChange(index, 'values', newPatterns);
                      }}
                      required
                    />
                    <Input
                      type="date"
                      value={pattern.endDate}
                      onChange={(e) => {
                        const newPatterns = [...season.values];
                        newPatterns[patIndex].endDate = e.target.value;
                        handleSeasonalityChange(index, 'values', newPatterns);
                      }}
                      required
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={pattern.factor}
                      onChange={(e) => {
                        const newPatterns = [...season.values];
                        newPatterns[patIndex].factor = parseFloat(e.target.value);
                        handleSeasonalityChange(index, 'values', newPatterns);
                      }}
                      required
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                <Label>Monthly Values</Label>
                {season.values.map((val: number, valIndex: number) => (
                  <Input
                    key={valIndex}
                    type="number"
                    step="0.1"
                    value={val}
                    onChange={(e) => {
                      const newValues = [...season.values];
                      newValues[valIndex] = parseFloat(e.target.value);
                      handleSeasonalityChange(index, 'values', newValues);
                    }}
                    required
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        <Button type="button" onClick={() => {
          setConfig(prev => ({
            ...prev,
            seasonality: [...prev.seasonality, { type: '', values: [] }],
          }));
        }}>
          Add Seasonality
        </Button>
      </div>

      {/* Bias Configuration */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Bias Configuration</h2>
        {config.biasConfig.map((bias, index) => (
          <div key={index} className="border p-4 rounded">
            <Label>Field</Label>
            <Input
              type="text"
              value={bias.field}
              onChange={(e) => handleBiasConfigChange(index, 'field', e.target.value)}
              required
            />
            <Label>Type</Label>
            <Select
              value={bias.type}
              onValueChange={(value) => handleBiasConfigChange(index, 'type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="categorical">Categorical</SelectItem>
                <SelectItem value="numerical">Numerical</SelectItem>
                <SelectItem value="probability">Probability</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center mt-2">
              <Switch
                checked={bias.time_varying}
                onCheckedChange={(checked) => handleBiasConfigChange(index, 'time_varying', checked)}
              />
              <Label className="ml-2">Time Varying</Label>
            </div>
            {/* Parameters */}
            <div className="space-y-2 mt-2">
              {bias.type === 'categorical' && (
                <>
                  <Label>Categories (comma separated)</Label>
                  <Input
                    type="text"
                    value={bias.params.categories.join(',')}
                    onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, categories: e.target.value.split(',') })}
                    required
                  />
                  <Label>Probabilities (comma separated)</Label>
                  <Input
                    type="text"
                    value={bias.params.probabilities.join(',')}
                    onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, probabilities: e.target.value.split(',').map(Number) })}
                    required
                  />
                </>
              )}
              {bias.type === 'numerical' && (
                <>
                  <Label>Mean</Label>
                  <Input
                    type="number"
                    value={bias.params.mean}
                    onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, mean: parseFloat(e.target.value) })}
                    required
                  />
                  <Label>Standard Deviation</Label>
                  <Input
                    type="number"
                    value={bias.params.std}
                    onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, std: parseFloat(e.target.value) })}
                    required
                  />
                  <Label>Min</Label>
                  <Input
                    type="number"
                    value={bias.params.min}
                    onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, min: parseFloat(e.target.value) })}
                    required
                  />
                  <Label>Max</Label>
                  <Input
                    type="number"
                    value={bias.params.max}
                    onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, max: parseFloat(e.target.value) })}
                    required
                  />
                </>
              )}
              {bias.type === 'probability' && (
                <>
                  <Label>Base Probability</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={bias.params.baseProbability}
                    onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, baseProbability: parseFloat(e.target.value) })}
                    required
                  />
                  <Label>Condition Weights (key=value, separated by commas)</Label>
                  <Input
                    type="text"
                    value={Object.entries(bias.params.conditionWeights).map(([k, v]) => `${k}=${v}`).join(',')}
                    onChange={(e) => {
                      const conditions = e.target.value.split(',').map(pair => {
                        const [key, value] = pair.split('=');
                        return [key.trim(), parseFloat(value)] as [string, number];
                      });
                      const conditionWeights = Object.fromEntries(conditions);
                      handleBiasConfigChange(index, 'params', { ...bias.params, conditionWeights });
                    }}
                    required
                  />
                </>
              )}
              {/* Common Parameters */}
              <Label>Reference Date</Label>
              <Input
                type="date"
                value={bias.params.referenceDate || ''}
                onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, referenceDate: e.target.value })}
                required={bias.time_varying}
              />
              {bias.time_varying && (
                <>
                  <Label>Time Varying Factor</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={bias.params.timeVaryingFactor || ''}
                    onChange={(e) => handleBiasConfigChange(index, 'params', { ...bias.params, timeVaryingFactor: parseFloat(e.target.value) })}
                    required
                  />
                </>
              )}
            </div>
          </div>
        ))}
        <Button type="button" onClick={() => {
          setConfig(prev => ({
            ...prev,
            biasConfig: [...prev.biasConfig, { field: '', type: 'categorical', time_varying: false, params: {} }],
          }));
        }}>
          Add Bias Configuration
        </Button>
      </div>

      <Button type="submit">Start Simulation</Button>
    </form>
  );
}