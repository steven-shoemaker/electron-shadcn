import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventChart from "@/components/EventChart";
import EventSummary from "@/components/EventSummary";
import { PieChartComponent, DemographicDataItem } from '@/components/charts/piechart';
import { AgeDistributionChart, TenureDistributionChart, EventTypeDistributionChart } from '@/components/charts/AdditionalCharts';
import { EventData, EmployeeEvent } from '@/lib/functions/eventGenerator';
import { Employee } from '@/lib/interfaces/Employee';
import { BarChart3, PieChart, Users, Calendar, Maximize2, Minimize2, Table as TableIcon } from 'lucide-react';
import EmployeeTable from '@/components/EmployeeTable';

interface SimulationDisplayProps {
  eventData: EventData[];
  employeeEvents: EmployeeEvent[];
  employees: Employee[];
  genderData: DemographicDataItem[];
  ethnicityData: DemographicDataItem[];
  departmentData: DemographicDataItem[];
  theme: 'light' | 'dark';
}

export default function SimulationDisplay({
  eventData,
  employeeEvents,
  employees,
  genderData,
  ethnicityData,
  departmentData,
  theme,
}: SimulationDisplayProps) {
  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const ChartContainer = ({ children, title, id }: { children: React.ReactNode; title: string; id: string }) => (
    <Card className={`${expandedChart === id ? 'col-span-3' : ''} transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );

  if (eventData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <Card className="w-full max-w-md p-6 text-center">
          <CardTitle className="mb-4">No Data Available</CardTitle>
          <p>Click "Generate Events" to see the simulation results.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow p-6 overflow-y-auto max-h-full">
      <EventSummary data={eventData} employeeEvents={employeeEvents} employees={employees} theme={theme} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Demographics
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <TableIcon className="w-4 h-4" />
            Employees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <ChartContainer title="" id="timeline">
              <EventChart data={eventData} theme={theme} />
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChartContainer title="Gender Distribution" id="gender">
              <PieChartComponent data={genderData} title="" />
            </ChartContainer>
            <ChartContainer title="Ethnicity Distribution" id="ethnicity">
              <PieChartComponent data={ethnicityData} title="" />
            </ChartContainer>
            <ChartContainer title="Department Distribution" id="department">
              <PieChartComponent data={departmentData} title="" />
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChartContainer title="Age Distribution" id="age">
              <AgeDistributionChart employees={employees} />
            </ChartContainer>
            <ChartContainer title="Tenure Distribution" id="tenure">
              <TenureDistributionChart employees={employees} />
            </ChartContainer>
            <ChartContainer title="Event Type Distribution" id="eventType">
              <EventTypeDistributionChart eventData={eventData} />
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <EmployeeTable employees={employees} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
