import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { format, parseISO, startOfWeek, startOfMonth, startOfQuarter, subMonths, subYears } from 'date-fns';
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
 
interface EventData {
  date: string;
  Hires: number;
  Terminations: number;
  Promotions: number;
}
import {Button} from '@/components/ui/button'

interface EventChartProps {
  data: EventData[];
  theme: 'light' | 'dark';
}

type AggregationType = 'Week' | 'Month' | 'Quarter' | '6M' | '2Y' | '5Y';

const EventChart: React.FC<EventChartProps> = ({ data, theme }) => {
  const [opacity, setOpacity] = useState({
    Hires: 1,
    Terminations: 1,
    Promotions: 1,
  });
  const [aggregation, setAggregation] = useState<AggregationType>('Week');

  const colors = {
    Hires: '#438ae8',
    Terminations: '#d67747',
    Promotions: '#68c198',
  };

  const handleMouseEnter = (o: any) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 0.5 });
  };

  const handleMouseLeave = (o: any) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 1 });
  };

  const axisTextColor = theme === 'light' ? '#aaaaaa' : '#64748B';

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
      case '2Y':
        return aggregateByPeriod(date => new Date(date.getFullYear() - (date.getFullYear() % 2), 0, 1));
      case '5Y':
        return aggregateByPeriod(date => new Date(date.getFullYear() - (date.getFullYear() % 5), 0, 1));
      default:
        return data;
    }
  }, [data, aggregation]);

  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[400px] ${theme === 'light' ? 'bg-white text-gray-500' : 'bg-gray-800 text-gray-400'} rounded-lg`}>
        <p className="text-lg font-medium">No data available. Generate events to see the chart.</p>
      </div>
    );
  }

  const formatXAxis = (date: string) => {
    const parsedDate = parseISO(date);
    switch (aggregation) {
      case 'Week':
        return format(parsedDate, 'MMM dd');
      case 'Month':
        return format(parsedDate, 'MMM yyyy');
      case 'Quarter':
        return `Q${Math.floor(parsedDate.getMonth() / 3) + 1} ${parsedDate.getFullYear()}`;
      case '6M':
        return `${parsedDate.getMonth() < 6 ? 'H1' : 'H2'} ${parsedDate.getFullYear()}`;
      case '2Y':
      case '5Y':
        return parsedDate.getFullYear().toString();
      default:
        return format(parsedDate, 'MMM dd, yyyy');
    }
  };

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  return (
    <div>
      <ChartContainer className="min-h-[200px] w-full" config={chartConfig}>
        <LineChart
          data={aggregateData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#bfbfbf" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            stroke={axisTextColor}
            tick={{ fontSize: 12, fill: axisTextColor }}
            axisLine={{ stroke: axisTextColor }}
          />
          <YAxis
            stroke={axisTextColor}
            tick={{ fontSize: 12, fill: axisTextColor }}
            axisLine={{ stroke: axisTextColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'light' ? '#FFFFFF' : '#2D3748',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: theme === 'light' ? '#2D3748' : '#FFFFFF' }}
            labelFormatter={(value) => formatXAxis(value as string)}
          />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            verticalAlign="top"
            height={36}
          />
          {Object.entries(colors).map(([key, color]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 8 }}
              opacity={opacity[key as keyof typeof opacity]}
              isAnimationActive={false}
            >
              <Line
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={0}
                dot={{ r: 4, fill: color, strokeWidth: 2, stroke: theme === 'light' ? '#FFFFFF' : '#1A202C' }}
                isAnimationActive={false}
                data={[aggregateData[aggregateData.length - 1]]}
              />
            </Line>
          ))}
        </LineChart>
      </ChartContainer>
      <div className="mt-4 flex justify-start space-x-2">
        {(['Week', 'Month', 'Quarter', '6M', '2Y', '5Y'] as AggregationType[]).map((agg) => (
          <Button
            key={agg}
            onClick={() => setAggregation(agg)}
            className={`px-3 py-1 rounded ${
              aggregation === agg
                ? 'bg-gray-300 text-black'
                : 'bg-white text-gray-500 hover:bg-gray-200'
            }`}
          >
            {agg}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EventChart;