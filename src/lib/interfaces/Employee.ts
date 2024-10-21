export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
export type Ethnicity = 'White' | 'Black or African American' | 'Asian' | 'Hispanic or Latino' | 'Native American' | 'Other';
export type Department = 'Sales' | 'Engineering' | 'Human Resources' | 'Marketing' | 'Finance' | 'Operations';

export interface Employee {
  id: string;
  hireDate: string; // Format: 'yyyy-MM-dd'
  terminationDate?: string; // Format: 'yyyy-MM-dd'
  promotionDates: string[]; // Array of promotion dates
  gender: Gender;
  age: number;
  ethnicity: Ethnicity;
  department: Department;
}