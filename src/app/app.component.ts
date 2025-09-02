import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TimesheetComponent],
  template: `
    <div class="d-flex">
      <app-sidebar></app-sidebar>
      <div class="main-content flex-grow-1">
        <app-timesheet></app-timesheet>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'Trackify';
}