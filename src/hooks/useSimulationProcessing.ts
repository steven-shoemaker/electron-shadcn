import { useCallback } from 'react';
import { generateCustomEvents, EventData, EmployeeEvent, DateRange, EventRates } from '../lib/functions/eventGenerator';
import { assignDemographics } from '../lib/functions/demographicAssigner';
import { Employee, Gender, Ethnicity, Department } from '../lib/interfaces/Employee';
import { DemographicDataItem } from '../components/charts/piechart';
import { SeasonalityFunction } from '../lib/functions/seasonality';

type BiasesType = {
  [K in 'Hires' | 'Terminations' | 'Promotions']: {
    gender: { [key in Gender]: number };
    ethnicity: { [key in Ethnicity]: number };
    department: { [key in Department]: number };
  };
};

type SeasonalityFunctions = {
  Hires: SeasonalityFunction;
  Terminations: SeasonalityFunction;
  Promotions: SeasonalityFunction;
};

export function useSimulationProcessing(
  dateRange: DateRange,
  selectedSeasonalities: SeasonalityFunctions,
  eventRates: EventRates,
  biases: BiasesType,
  setEventData: React.Dispatch<React.SetStateAction<EventData[]>>,
  setEmployeeEvents: React.Dispatch<React.SetStateAction<EmployeeEvent[]>>,
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
  setGenderData: React.Dispatch<React.SetStateAction<DemographicDataItem[]>>,
  setEthnicityData: React.Dispatch<React.SetStateAction<DemographicDataItem[]>>,
  setDepartmentData: React.Dispatch<React.SetStateAction<DemographicDataItem[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const generatedEvents = generateCustomEvents(dateRange, selectedSeasonalities, eventRates);
      const dailyEvents: EventData[] = generatedEvents.dailyEvents;
      const employeeEvents: EmployeeEvent[] = generatedEvents.employeeEvents;
      let newEmployees: Employee[] = generatedEvents.employees;

      // Assign demographics only for new hires
      newEmployees = assignDemographics(
        newEmployees,
        'hire',
        biases.Hires
      );

      const genderCounts: Record<Gender, number> = {
        Male: 0,
        Female: 0,
        'Non-binary': 0,
        'Prefer not to say': 0,
      };
      
      const ethnicityCounts: Record<Ethnicity, number> = {
        White: 0,
        'Black or African American': 0,
        Asian: 0,
        'Hispanic or Latino': 0,
        'Native American': 0,
        Other: 0,
      };
      
      const departmentCounts: Record<Department, number> = {
        Sales: 0,
        Engineering: 0,
        'Human Resources': 0,
        Marketing: 0,
        Finance: 0,
        Operations: 0,
      };

      // Aggregate event data
      const aggregatedEventData: EventData[] = dailyEvents.map(event => ({
        date: event.date,
        Hires: event.Hires,
        Terminations: event.Terminations,
        Promotions: event.Promotions,
      }));

      newEmployees.forEach((employee) => {
        if (employee.gender) genderCounts[employee.gender] = (genderCounts[employee.gender] || 0) + 1;
        if (employee.ethnicity) ethnicityCounts[employee.ethnicity] = (ethnicityCounts[employee.ethnicity] || 0) + 1;
        if (employee.department) departmentCounts[employee.department] = (departmentCounts[employee.department] || 0) + 1;
      });

      const newGenderData: DemographicDataItem[] = Object.entries(genderCounts).map(([key, value]) => ({
        name: key,
        value: value,
        color: '',
      }));

      const newEthnicityData: DemographicDataItem[] = Object.entries(ethnicityCounts).map(([key, value]) => ({
        name: key,
        value: value,
        color: '',
      }));

      const newDepartmentData: DemographicDataItem[] = Object.entries(departmentCounts).map(([key, value]) => ({
        name: key,
        value: value,
        color: '',
      }));

      setGenderData(newGenderData);
      setEthnicityData(newEthnicityData);
      setDepartmentData(newDepartmentData);
      setEventData(aggregatedEventData);
      setEmployeeEvents(employeeEvents);
      setEmployees(newEmployees);
    } catch (err) {
      setError('An error occurred while generating events.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, selectedSeasonalities, eventRates, biases, setEventData, setEmployeeEvents, setEmployees, setGenderData, setEthnicityData, setDepartmentData, setIsLoading, setError]);

  return {
    handleGenerate,
  };
}
