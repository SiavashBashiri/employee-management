import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { Employee } from './features/employees/components/employee/employee';
import { Tag } from './features/tags/components/tag/tag';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      { path: 'employees', component: Employee },
      { path: 'tags', component: Tag },
    ],
  },
];
