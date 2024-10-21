// reporting.tsx
import React from 'react';
import { SimulationConfig } from './config';
import { EmployeeEvent } from './event_generator';

interface ReportingProps {
  config: SimulationConfig;
  events: EmployeeEvent[];
}

export default function ReportingComponent({ config, events }: ReportingProps) {
  const generateReport = () => {
    const hires = events.filter(e => e.type === 'hire').length;
    const terminations = events.filter(e => e.type === 'termination').length;
    const promotions = events.filter(e => e.type === 'promotion').length;
    const netGrowth = hires - terminations;
    const finalEmployeeCount = config.initialEmployeeCount + netGrowth;

    return {
      totalEvents: events.length,
      hires,
      terminations,
      promotions,
      netGrowth,
      finalEmployeeCount,
    };
  };

  const report = generateReport();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Simulation Report</h2>
      <ul className="space-y-2">
        <li>Total Events: {report.totalEvents}</li>
        <li>Total Hires: {report.hires}</li>
        <li>Total Terminations: {report.terminations}</li>
        <li>Total Promotions: {report.promotions}</li>
        <li>Net Growth: {report.netGrowth}</li>
        <li>Final Employee Count: {report.finalEmployeeCount}</li>
      </ul>
    </div>
  );
}