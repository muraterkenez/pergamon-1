export interface Animal {
  id: string;
  nationalId: string;
  name?: string;
  birthDate: Date;
  gender: 'female' | 'male';
  breed: string;
  status: 'active' | 'sold' | 'deceased';
  group: 'lactating' | 'dry' | 'young' | 'treatment';
  mother?: {
    id: string;
    nationalId: string;
    name?: string;
  };
  father?: {
    id: string;
    nationalId: string;
    name?: string;
  };
  imageUrl?: string;
  weight: number;
  height: number;
  bodyConditionScore: number;
  reproductiveStatus?: 'open' | 'inseminated' | 'pregnant' | 'calving';
  lastInseminationDate?: Date;
  expectedCalvingDate?: Date;
  lactationNumber: number;
  rfidTag?: string;
  welfareScore: number;
  notes?: string;
}

export interface AnimalEvent {
  id: string;
  animalId: string;
  date: Date;
  type: 'health' | 'reproduction' | 'transfer' | 'measurement' | 'welfare';
  description: string;
  details: Record<string, any>;
  performedBy: string;
}