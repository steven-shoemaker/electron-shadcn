import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";

export interface DemographicDataItem {
  name: string;
  value: number;
  color?: string;
}

interface PieChartComponentProps {
  data: DemographicDataItem[];
  title: string;
}

export function PieChartComponent({ data, title }: PieChartComponentProps) {
  // Define default colors if not provided
  const defaultColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00c49f",
    "#ffbb28",
  ];

  // Prepare chart configuration
  const chartConfig = {
    ...Object.fromEntries(
      data.map((item, index) => [
        item.name,
        {
          color: item.color || defaultColors[index % defaultColors.length],
        },
      ])
    ),
  };

  return (
    <ChartContainer className="h-[300px] w-full" config={chartConfig}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">
        {title}
      </h3>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No data available. Generate events to see the demographics.
        </div>
      )}
      <ChartLegend content={<CustomLegend />} />
    </ChartContainer>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
        
      <ChartTooltipContent>
        <div className="flex flex-col">
          <span className="font-bold">{data.name}</span>
          <span>{`Value: ${data.value}`}</span>
        </div>
      </ChartTooltipContent>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <ChartLegendContent>
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center mr-4">
            <div
              className="w-3 h-3 mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </ChartLegendContent>
    );
  }
  return null;
};