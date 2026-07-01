import { OfficeLocation } from '../consts/office-location.const';

export interface Employee {
  id: string | number;
  firstName: string;
  lastName: string;
  office: OfficeLocation;
  dateOfBirth: string;
  phoneNumber: string;
  positiveTagIds: string[];
  negativeTagIds: number[];
}
