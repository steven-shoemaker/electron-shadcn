import { Employee, Gender, Ethnicity, Department } from '../interfaces/Employee';

const genders: Gender[] = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const ethnicities: Ethnicity[] = ['White', 'Black or African American', 'Asian', 'Hispanic or Latino', 'Native American', 'Other'];
const departments: Department[] = ['Sales', 'Engineering', 'Human Resources', 'Marketing', 'Finance', 'Operations'];

export function assignDemographics(employees: Employee[]): Employee[] {
  return employees.map(employee => ({
    ...employee,
    gender: genders[Math.floor(Math.random() * genders.length)],
    age: Math.floor(Math.random() * (65 - 18 + 1)) + 18, // Random age between 18 and 65
    ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
  }));
}