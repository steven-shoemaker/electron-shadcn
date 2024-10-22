import { useState } from 'react';
import { Gender, Ethnicity, Department } from '../lib/interfaces/Employee';
import { EventRates } from '../lib/functions/eventGenerator';
import { useSimulationState } from './useSimulationState';

const eventTypes = ['Hires', 'Terminations', 'Promotions'] as const;
export type EventType = typeof eventTypes[number];

type BiasesType = {
  [K in EventType]: {
    gender: { [key in Gender]: number };
    ethnicity: { [key in Ethnicity]: number };
    department: { [key in Department]: number };
  };
};

export function useSimulationConfig() {
  const { setSeasonalities, setEventRates } = useSimulationState();

  const [biases, setBiases] = useState<BiasesType>({
    Hires: {
      gender: {
        Male: 0.5,
        Female: 0.5,
        'Non-binary': 0.1,
        'Prefer not to say': 0.1,
      },
      ethnicity: {
        White: 0.5,
        'Black or African American': 0.5,
        Asian: 0.5,
        'Hispanic or Latino': 0.5,
        'Native American': 0.3,
        Other: 0.3,
      },
      department: {
        Sales: 0.6,
        Engineering: 0.7,
        'Human Resources': 0.4,
        Marketing: 0.5,
        Finance: 0.5,
        Operations: 0.5,
      },
    },
    Terminations: {
      gender: {
        Male: 0.5,
        Female: 0.5,
        'Non-binary': 0.1,
        'Prefer not to say': 0.1,
      },
      ethnicity: {
        White: 0.5,
        'Black or African American': 0.5,
        Asian: 0.5,
        'Hispanic or Latino': 0.5,
        'Native American': 0.3,
        Other: 0.3,
      },
      department: {
        Sales: 0.6,
        Engineering: 0.7,
        'Human Resources': 0.4,
        Marketing: 0.5,
        Finance: 0.5,
        Operations: 0.5,
      },
    },
    Promotions: {
      gender: {
        Male: 0.5,
        Female: 0.5,
        'Non-binary': 0.1,
        'Prefer not to say': 0.1,
      },
      ethnicity: {
        White: 0.5,
        'Black or African American': 0.5,
        Asian: 0.5,
        'Hispanic or Latino': 0.5,
        'Native American': 0.3,
        Other: 0.3,
      },
      department: {
        Sales: 0.6,
        Engineering: 0.7,
        'Human Resources': 0.4,
        Marketing: 0.5,
        Finance: 0.5,
        Operations: 0.5,
      },
    },
  });

  const handleSeasonalityChange = (event: EventType, value: string) => {
    setSeasonalities((prev) => ({ ...prev, [event]: value }));
  };

  const handleRateChange = (field: keyof EventRates, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setEventRates((prev) => ({ ...prev, [field]: num / 100 }));
    }
  };

  const handleBiasChange = (
    event: EventType,
    demographic: keyof BiasesType[EventType],
    group: string,
    value: number
  ) => {
    setBiases((prev) => ({
      ...prev,
      [event]: {
        ...prev[event],
        [demographic]: {
          ...prev[event][demographic],
          [group]: value,
        },
      },
    }));
  };

  return {
    biases,
    handleSeasonalityChange,
    handleRateChange,
    handleBiasChange,
  };
}
