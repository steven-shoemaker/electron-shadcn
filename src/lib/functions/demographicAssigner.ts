import { Employee, Gender, Ethnicity, Department } from '../interfaces/Employee';

/**
 * Bias weights for each demographic category based on event type.
 * These weights are now passed as parameters to allow dynamic configuration.
 */

function weightedRandomSelect<T extends string>(options: T[], weights: Record<T, number>): T {
  const weightsValues: number[] = Object.values(weights);
  const totalWeight: number = weightsValues.reduce((sum: number, weight: number) => sum + weight, 0);
  const random: number = Math.random() * totalWeight;
  
  let cumulativeWeight: number = 0;
  for (const option of options) {
    cumulativeWeight += weights[option];
    if (random <= cumulativeWeight) {
      return option;
    }
  }

  // Fallback in case of floating-point precision issues
  return options[options.length - 1];
}

/**
 * Assigns demographics to employees based on the provided bias weights.
 * @param employees - The list of employees to assign demographics to.
 * @param eventType - The type of event triggering the assignment ('hire', 'termination', 'promotion').
 * @param biasWeights - The bias weights for each demographic category corresponding to the event type.
 * @returns A new list of employees with assigned demographics.
 */
export function assignDemographics(
  employees: Employee[],
  eventType: 'hire' | 'termination' | 'promotion',
  biasWeights: {
    gender: Record<Gender, number>;
    ethnicity: Record<Ethnicity, number>;
    department: Record<Department, number>;
  }
): Employee[] {
  const genders: Gender[] = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const ethnicities: Ethnicity[] = ['White', 'Black or African American', 'Asian', 'Hispanic or Latino', 'Native American', 'Other'];
  const departments: Department[] = ['Sales', 'Engineering', 'Human Resources', 'Marketing', 'Finance', 'Operations'];

  return employees.map(employee => ({
    ...employee,
    gender: weightedRandomSelect(genders, biasWeights.gender),
    age: Math.floor(Math.random() * (65 - 18 + 1)) + 18, // Random age between 18 and 65
    ethnicity: weightedRandomSelect(ethnicities, biasWeights.ethnicity),
    department: weightedRandomSelect(departments, biasWeights.department),
  }));
}
