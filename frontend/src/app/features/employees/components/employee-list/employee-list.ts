import { Component, inject } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { EmployeesService } from '../../services/employee.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-employee-list',
  imports: [MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  public readonly displayedColumns: string[] = [
    'firstName',
    'lastName',
    'office',
    'dateOfBirth',
    'phoneNumber',
  ];
  public readonly employeesService = inject(EmployeesService);

  public onPageChange(event: PageEvent): void {
    this.employeesService.setPagination(event.pageIndex + 1, event.pageSize);
  }
}
