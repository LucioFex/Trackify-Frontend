import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { MateriasComponent } from './components/materias/materias.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarioComponent } from './components/calendario/calendario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TimesheetComponent, MateriasComponent, DashboardComponent, CalendarioComponent],
  template: `
    <div class="d-flex">
      <app-sidebar (menuSelected)="onMenuSelected($event)"></app-sidebar>
      <div class="main-content flex-grow-1">
        <app-timesheet *ngIf="currentView === 'timesheet'"></app-timesheet>
        <app-materias *ngIf="currentView === 'materias'"></app-materias>
        <app-dashboard *ngIf="currentView === 'dashboard'"></app-dashboard>
        <app-calendario *ngIf="currentView === 'calendario'"></app-calendario>
        <div *ngIf="currentView !== 'timesheet' && currentView !== 'materias' && currentView !== 'dashboard' && currentView !== 'calendario'" class="text-center mt-5">
          <h3 class="text-muted">{{ getViewTitle(currentView) }}</h3>
          <p class="text-muted">Esta sección estará disponible próximamente</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .d-flex {
      display: flex;
    }

    .main-content {
      flex: 1;
      min-height: 100vh;
    }

    .flex-grow-1 {
      flex-grow: 1;
    }

    .text-center {
      text-align: center;
      padding: 48px 24px;
      margin-left: 250px;
    }

    .mt-5 {
      margin-top: 3rem;
    }

    .text-muted {
      color: #6B7280;
    }
  `]
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
      'dashboard': 'Dashboard',
      'materias': 'Materias'
    };
    return titles[view] || view;
  }
}