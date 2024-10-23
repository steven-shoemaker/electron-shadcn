import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronLeft, ChevronRight, Share2, Plus } from 'lucide-react';
import { format, parseISO, startOfWeek, startOfMonth, startOfQuarter, subMonths, subYears } from 'date-fns';
import { Button } from '@/components/ui/button';

interface EventData {
  date: string;
  Hires: number;
  Terminations: number;
  Promotions: number;
}

interface EventChartProps {
  data: EventData[];
  theme: 'light' | 'dark';
}

type AggregationType = 'Week' | 'Month' | 'Quarter' | '6M' | 'Year' | '2Y' | '5Y' | 'Custom';

const EventChart: React.FC<EventChartProps> = ({ data, theme }) => {
  const [aggregation, setAggregation] = useState<AggregationType>('6M');
  const [currentValue, setCurrentValue] = useState<number>(0);

  const axisTextColor = theme === 'light' ? '#999' : '#64748B';

  const aggregateData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const aggregateByPeriod = (startOfPeriod: (date: Date) => Date) => {
      const aggregated: { [key: string]: EventData } = {};
      data.forEach(item => {
        const date = startOfPeriod(parseISO(item.date));
        const key = date.toISOString();
        if (!aggregated[key]) {
          aggregated[key] = { date: key, Hires: 0, Terminations: 0, Promotions: 0 };
        }
        aggregated[key].Hires += item.Hires;
        aggregated[key].Terminations += item.Terminations;
        aggregated[key].Promotions += item.Promotions;
      });
      return Object.values(aggregated);
    };

    switch (aggregation) {
      case 'Week':
        return aggregateByPeriod(date => startOfWeek(date, { weekStartsOn: 1 }));
      case 'Month':
        return aggregateByPeriod(startOfMonth);
      case 'Quarter':
        return aggregateByPeriod(startOfQuarter);
      case '6M':
        return aggregateByPeriod(date => startOfMonth(subMonths(date, date.getMonth() % 6)));
      case 'Year':
        return aggregateByPeriod(date => new Date(date.getFullYear(), 0, 1));
      case '2Y':
        return aggregateByPeriod(date => new Date(date.getFullYear() - (date.getFullYear() % 2), 0, 1));
      case '5Y':
        return aggregateByPeriod(date => new Date(date.getFullYear() - (date.getFullYear() % 5), 0, 1));
      default:
        return data;
    }
  }, [data, aggregation]);

  const formatXAxis = (dateString: string) => {
    const date = parseISO(dateString);
    switch (aggregation) {
      case 'Week':
        return format(date, 'MMM d');
      case 'Month':
        return format(date, 'MMM yyyy');
      case 'Quarter':
        return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      case '6M':
        return `${date.getMonth() < 6 ? 'H1' : 'H2'} ${date.getFullYear()}`;
      case 'Year':
      case '2Y':
      case '5Y':
        return date.getFullYear().toString();
      default:
        return format(date, 'MMM d, yyyy');
    }
  };

  const formatYAxis = (value: number) => {
    if (value === 0) return '0';
    if (value < 0) return `-${Math.abs(Math.round(value / 1000))}K`;
    return `${Math.round(value / 1000)}K`;
  };

  return (
    <div className="w-full min-h-[600px] bg-white p-6 space-y-6">
      <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">Simulation Events</h1>
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">SIMULATION</span>
            </div>
            <div className="text-sm text-gray-500">{format(parseISO(data[0].date), 'MMM d, yyyy')} - {format(parseISO(data[data.length - 1].date), 'MMM d, yyyy')}</div>
      </div>

      <div className="border-l-4 border-blue-500 pl-3">
        <div className="text-sm text-gray-500">Total Events</div>
        <div className="text-3xl font-semibold">{currentValue.toLocaleString()}</div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aggregateData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tickMargin={10}
              stroke="#999"
              tick={{ fill: '#999', fontSize: 12 }}
              axisLine={{ stroke: '#eee' }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              stroke="#999"
              tick={{ fill: '#999', fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
              labelFormatter={(label: string) => formatXAxis(label)}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #eee',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="Hires" 
              stroke="#2196f3" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="Terminations" 
              stroke="#f44336" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="Promotions" 
              stroke="#4caf50" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-4">
          {(['Week', 'Month', 'Quarter', '6M', 'Year', '2Y', '5Y', 'Custom'] as AggregationType[]).map((period) => (
            <Button
              key={period}
              variant="ghost"
              size="sm"
              onClick={() => setAggregation(period)}
              className={`${
                aggregation === period
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {period}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">Last 180 days</span>
          <Button variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventChart;
