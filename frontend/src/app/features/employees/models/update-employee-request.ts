import { CreateEmployeeRequest } from './create-employee-request';

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  id: string;
}
