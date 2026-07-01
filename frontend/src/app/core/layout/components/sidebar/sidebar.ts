import { CommonModule } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../models/menu-item';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  menuItems: Signal<MenuItem[]> = signal([
    { icon: 'group', label: 'Employees', route: '/employees' },
    { icon: 'style', label: 'Tags', route: '/tags' },
  ]);
}
