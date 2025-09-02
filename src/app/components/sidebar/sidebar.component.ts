import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
      <div class="logo d-flex align-items-center">
        <div class="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2" 
             style="width: 24px; height: 24px;">
          <span style="color: white; font-size: 14px; font-weight: bold;">✓</span>
        </div>
        Trackify
      </div>
      
      <nav class="mt-4">
        <a href="#" class="nav-item active" (click)="selectMenuItem('timesheet')">
          <span>⏱️</span>
          Timesheet
        </a>
        <a href="#" class="nav-item" (click)="selectMenuItem('calendario')">
          <span>📅</span>
          Calendario
        </a>
        <a href="#" class="nav-item" (click)="selectMenuItem('reportes')">
          <span>📊</span>
          Reportes
        </a>
        <a href="#" class="nav-item" (click)="selectMenuItem('dashboard')">
          <span>📈</span>
          Dashboard
        </a>
        <a href="#" class="nav-item" (click)="selectMenuItem('materias')">
          <span>📚</span>
          Materias
        </a>
      </nav>
    </div>
  `
})
export class SidebarComponent {
  selectedItem = 'timesheet';
  
  selectMenuItem(item: string) {
    this.selectedItem = item;
    // Aquí se implementaría la navegación entre componentes
  }
}