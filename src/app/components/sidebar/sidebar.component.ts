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
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: #1F2937;
      color: white;
      padding: 24px 0;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      overflow-y: auto;
    }

    .logo {
      font-size: 20px;
      font-weight: 700;
      padding: 0 24px 32px 24px;
      border-bottom: 1px solid #374151;
      margin-bottom: 24px;
    }

    .nav {
      display: flex;
      flex-direction: column;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 24px;
      color: #D1D5DB;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: #374151;
      color: white;
      text-decoration: none;
    }

    .nav-item.active {
      background: #F59E0B;
      color: white;
      border-left-color: #D97706;
    }
  `]
})
export class SidebarComponent {
  selectedItem = 'timesheet';
  
  @Output() menuSelected = new EventEmitter<string>();
  
  selectMenuItem(item: string) {
    this.selectedItem = item;
    this.menuSelected.emit(item);
  }
}