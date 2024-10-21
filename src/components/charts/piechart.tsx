"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
export interface DemographicDataItem {
  name: string;
  value: number;
  color: string;
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

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {title}
      </h3>

      {data && data.length > 0 ? (
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={150}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || defaultColors[index % defaultColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No data available. Generate events to see the demographics.
        </div>
      )}
    </div>
  );
}