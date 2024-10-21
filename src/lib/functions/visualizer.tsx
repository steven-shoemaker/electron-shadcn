// visualizer.tsx
import React from 'react';
import { SimulationConfig } from './config';
import { EmployeeEvent } from './event_generator';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VisualizerProps {
  config: SimulationConfig;
  events: EmployeeEvent[];
}

export default function VisualizerComponent({ config, events }: VisualizerProps) {
  const prepareChartData = () => {
    const data: { date: string; employees: number; hires: number; terminations: number; promotions: number }[] = [];
    let currentDate = new Date(config.startDate);
    const endDate = new Date(config.endDate);
    let employeeCount = config.initialEmployeeCount;

    while (currentDate <= endDate) {
      const monthEvents = events.filter(e => e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear());
      const hires = monthEvents.filter(e => e.type === 'hire').length;
      const terminations = monthEvents.filter(e => e.type === 'termination').length;
      const promotions = monthEvents.filter(e => e.type === 'promotion').length;

      employeeCount += hires - terminations;

      data.push({
        date: currentDate.toISOString().slice(0, 7),
        employees: employeeCount,
        hires,
        terminations,
        promotions,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return data;
  };

  const chartData = prepareChartData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Employee Count Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="employees" stroke="#8884d8" name="Total Employees" />
          <Line type="monotone" dataKey="hires" stroke="#82ca9d" name="Hires" />
          <Line type="monotone" dataKey="terminations" stroke="#ff7300" name="Terminations" />
          <Line type="monotone" dataKey="promotions" stroke="#0088fe" name="Promotions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}