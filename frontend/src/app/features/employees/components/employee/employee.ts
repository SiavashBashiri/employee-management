import { Component } from '@angular/core';
import { EmployeeList } from '../employee-list/employee-list';

@Component({
  selector: 'app-employee',
  imports: [EmployeeList],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
})
export class Employee {}
