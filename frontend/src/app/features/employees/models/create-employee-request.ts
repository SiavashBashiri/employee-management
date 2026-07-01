import { OfficeLocation } from '../consts/office-location.const';

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  office: OfficeLocation;
  dateOfBirth: string;
  phoneNumber: string;
  positiveTagIds: string[];
  negativeTagIds: number[];
}
