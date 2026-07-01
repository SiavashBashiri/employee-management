import { environment } from '../../../../environment';

export const ApiEndpoints = {
  employees: `${environment.apiUrl}/employees`,
  tags: `${environment.apiUrl}/tags`,
} as const;
