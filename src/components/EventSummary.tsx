import React from 'react';
import { EventData, EmployeeEvent    } from '@/lib/functions/eventGenerator';
import { Employee } from '@/lib/interfaces/Employee';

interface EventSummaryProps {
  data: EventData[];
  theme: 'light' | 'dark';
  employeeEvents: EmployeeEvent[];
  employees: Employee[];
}

const EventSummary: React.FC<EventSummaryProps> = ({ data, theme }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`mb-6 p-4 rounded-lg ${theme === 'light' ? 'bg-white text-gray-500' : 'bg-gray-800 text-gray-400'}`}>
        <p className="text-lg font-medium">No data available. Generate events to see the summary.</p>
      </div>
    );
  }

  const calculateStats = (key: keyof EventData) => {
    const values = data.map(item => item[key] as number);
    const total = values.reduce((sum, value) => sum + value, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return { total, avg: avg.toFixed(2), max, min };
  };

  const stats = {
    Hires: calculateStats('Hires'),
    Terminations: calculateStats('Terminations'),
    Promotions: calculateStats('Promotions'),
  };

  const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  const colors = {
    Hires: '#438ae8',
    Terminations: '#d67747',
    Promotions: '#68c198',
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${textColor}`}>
      {Object.entries(stats).map(([key, stat]) => (
        <div key={key} className={`${bgColor} p-4 rounded-lg border ${borderColor}`}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: colors[key as keyof typeof colors] }}>{key}</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-xl font-bold">{stat.total}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Average</p>
              <p className="text-xl font-bold">{stat.avg}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Max</p>
              <p className="text-xl font-bold">{stat.max}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Min</p>
              <p className="text-xl font-bold">{stat.min}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventSummary;