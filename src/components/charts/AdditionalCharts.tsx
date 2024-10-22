import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Employee } from '@/lib/interfaces/Employee';
import { EventData } from '@/lib/functions/eventGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartProps {
  data: any[];
  title: string;
  dataKey: string;
  fill: string;
}

const BarChartComponent: React.FC<ChartProps> = ({ data, title, dataKey, fill }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={fill} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const AgeDistributionChart: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const ageData = employees.reduce((acc, employee) => {
    const ageGroup = Math.floor(employee.age / 10) * 10;
    const group = `${ageGroup}-${ageGroup + 9}`;
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(ageData).map(([name, value]) => ({ name, value }));

  return <BarChartComponent data={data} title="Age Distribution" dataKey="value" fill="#8884d8" />;
};

export const TenureDistributionChart: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const tenureData = employees.reduce((acc, employee) => {
    const tenure = new Date().getFullYear() - new Date(employee.hireDate).getFullYear();
    const group = Math.floor(tenure / 5) * 5;
    const groupName = `${group}-${group + 4} years`;
    acc[groupName] = (acc[groupName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(tenureData).map(([name, value]) => ({ name, value }));

  return <BarChartComponent data={data} title="Tenure Distribution" dataKey="value" fill="#82ca9d" />;
};

export const EventTypeDistributionChart: React.FC<{ eventData: EventData[] }> = ({ eventData }) => {
  const eventTypeData = eventData.reduce((acc, event) => {
    acc.Hires += event.Hires;
    acc.Terminations += event.Terminations;
    acc.Promotions += event.Promotions;
    return acc;
  }, { Hires: 0, Terminations: 0, Promotions: 0 });

  const data = Object.entries(eventTypeData).map(([name, value]) => ({ name, value }));

  return <BarChartComponent data={data} title="Event Type Distribution" dataKey="value" fill="#ffc658" />;
};
