import React from 'react';
import EventChart from "@/components/EventChart";
import EventSummary from "@/components/EventSummary";
import { PieChartComponent, DemographicDataItem } from '@/components/charts/piechart';
import { EventData, EmployeeEvent } from '@/lib/functions/eventGenerator';
import { Employee } from '@/lib/interfaces/Employee';
import { Card, CardContent, CardHeader ,CardFooter, CardTitle, CardDescription } from '../ui/card';
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
  return (
    <div className="flex-grow p-6 overflow-y-auto max-h-full">
      {eventData.length > 0 ? (
        <>
          <EventSummary data={eventData} employeeEvents={employeeEvents} employees={employees} theme={theme} />
          <Card className='shadow-none pl-0 m-0 justify-start'>
            <CardContent className='p-1 m-1'>
              <EventChart data={eventData} theme={theme} />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <PieChartComponent data={genderData} title="Gender Distribution" />
            <PieChartComponent data={ethnicityData} title="Ethnicity Distribution" />
            <PieChartComponent data={departmentData} title="Department Distribution" />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          Click "Generate Events" to see the simulation results.
        </div>
      )}
    </div>
  );
}
