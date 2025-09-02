import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { MateriasComponent } from './components/materias/materias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TimesheetComponent, MateriasComponent],
  template: `
    <div class="d-flex">
      <app-sidebar (menuSelected)="onMenuSelected($event)"></app-sidebar>
      <div class="main-content flex-grow-1">
        <app-timesheet *ngIf="currentView === 'timesheet'"></app-timesheet>
        <app-materias *ngIf="currentView === 'materias'"></app-materias>
        <div *ngIf="currentView !== 'timesheet' && currentView !== 'materias'" class="text-center mt-5">
          <h3 class="text-muted">{{ getViewTitle(currentView) }}</h3>
          <p class="text-muted">Esta sección estará disponible próximamente</p>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'Trackify';
  currentView = 'timesheet';
  
  onMenuSelected(view: string) {
    this.currentView = view;
  }
  
  getViewTitle(view: string): string {
    const titles: { [key: string]: string } = {
      'calendario': 'Calendario',
      'reportes': 'Reportes',
      'dashboard': 'Dashboard'
    };
    return titles[view] || view;
  }
}