import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Employee } from '../models/employee';
import { OfficeLocation } from '../consts/office-location.const';
import { ApiEndpoints } from '../../../core/consts/api-endpoints';
import { CreateEmployeeRequest } from '../models/create-employee-request';
import { UpdateEmployeeRequest } from '../models/update-employee-request';
import { Observable } from 'rxjs';
import { ListResponse } from '../../../shared/models/list-response';

@Service()
export class EmployeesService {
  public readonly data = computed(() => this.employees.value()?.data ?? []);
  public readonly meta = computed(() => this.employees.value()?.meta);

  private readonly api = ApiEndpoints.employees;
  private readonly http = inject(HttpClient);
  private readonly office = signal<OfficeLocation | null>(null);
  private readonly search = signal('');
  private readonly page = signal(1);
  private readonly limit = signal(5);

  public readonly employees = httpResource<ListResponse<Employee[]>>(() => ({
    url: this.api,
    method: 'GET',
    params: {
      page: this.page(),
      limit: this.limit(),
      ...(this.search() ? { search: this.search() } : {}),
      ...(this.office() ? { office: this.office()! } : {}),
    },
  }));

  public details(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.api}/${id}`);
  }

  public setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  public publicsetOffice(value: OfficeLocation | null): void {
    this.office.set(value);
    this.page.set(1);
  }

  public setPagination(page: number, limit: number): void {
    this.page.set(page);
    this.limit.set(limit);
  }
}
