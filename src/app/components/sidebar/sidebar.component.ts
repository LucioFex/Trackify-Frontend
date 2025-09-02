import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
      <div class="logo">
        ⏱️ Trackify
      </div>
      <nav class="nav flex-column">
        <a href="#" 
           class="nav-item" 
           [class.active]="selectedItem === 'timesheet'" 
           (click)="selectMenuItem('timesheet')">
          ⏱️ Timesheet
        </a>
        <a href="#" 
           class="nav-item" 
           [class.active]="selectedItem === 'calendario'" 
           (click)="selectMenuItem('calendario')">
          📅 Calendario
        </a>
        <a href="#" 
           class="nav-item" 
           [class.active]="selectedItem === 'reportes'" 
           (click)="selectMenuItem('reportes')">
          📊 Reportes
        </a>
        <a href="#" 
           class="nav-item" 
           [class.active]="selectedItem === 'dashboard'" 
           (click)="selectMenuItem('dashboard')">
          📈 Dashboard
        </a>
        <a href="#" 
           class="nav-item" 
           [class.active]="selectedItem === 'materias'" 
           (click)="selectMenuItem('materias')">
          📚 Materias
        </a>
      </nav>
    </div>
  `
})
export class SidebarComponent {
  selectedItem = 'timesheet';
  
  @Output() menuSelected = new EventEmitter<string>();
  
  selectMenuItem(item: string) {
    this.selectedItem = item;
    this.menuSelected.emit(item);
  }
}