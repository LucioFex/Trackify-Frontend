import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Materia {
  id: number;
  name: string;
  icon: string;
  color: string;
  cuatrimestre: string;
  tiempoInvertido: string;
  notas: string;
  parcial1: number;
  parcial2: number;
  final: number;
  objetivos?: string;
}

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="materias-container">
      <div class="materias-header">
        <h2 class="materias-title">Gestión de materias</h2>
        <div class="header-controls">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Buscar materia..."
            [(ngModel)]="searchTerm">
          <button class="add-button" (click)="openAddModal()">Añadir</button>
        </div>
      </div>
      
      <div class="materias-table-container">
        <table class="materias-table">
          <thead>
            <tr class="materias-table-header">
              <th>Materia</th>
              <th>Cuatrimestre</th>
              <th>Tiempo invertido</th>
              <th>Notas (P1 • P2 • Final)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let materia of filteredMaterias" class="materias-table-row">
              <td class="materia-cell">
                <div class="materia-color-indicator" [style.background-color]="materia.color"></div>
                <div class="materia-icon" [style.background-color]="materia.color">
                  {{ materia.icon }}
                </div>
                <span class="materia-name">{{ materia.name }}</span>
              </td>
              <td class="cuatrimestre-cell">{{ materia.cuatrimestre }}</td>
              <td class="tiempo-cell">
                <span class="tiempo-badge">{{ materia.tiempoInvertido }}</span>
              </td>
              <td class="notas-cell">{{ materia.notas }}</td>
              <td class="acciones-cell">
                <button class="action-btn edit-btn" (click)="editMateria(materia)">Editar</button>
                <button class="action-btn delete-btn" (click)="confirmDelete(materia)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      
        <div class="materias-tip">
          Tip: desde "Editar" puedes abrir el formulario de Agregar/Editar materia (el que diseñamos) con los datos precargados.
        </div>
      </div>
    </div>

    <!-- Modal de Nueva Materia -->
    <div class="modal-overlay" *ngIf="showAddModal" (click)="closeAddModal()">
      <div class="add-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Nueva materia</h3>
          <button class="close-btn" (click)="closeAddModal()">×</button>
        </div>
        
        <div class="modal-body">
          <p class="modal-subtitle">Completa los datos básicos y las notas. A la derecha verás el resumen y la vista previa.</p>
          
          <div class="row">
            <div class="col-md-7">
              <!-- Nombre de la materia -->
              <div class="form-group mb-4">
                <label class="form-label">Nombre de la materia</label>
                <input 
                  type="text" 
                  class="form-control modal-input" 
                  [(ngModel)]="newMateria.name"
                  placeholder="Ej: Cálculo I">
              </div>
              
              <!-- Cuatrimestre -->
              <div class="form-group mb-4">
                <label class="form-label">Cuatrimestre</label>
                <select class="form-control modal-input" [(ngModel)]="newMateria.cuatrimestre">
                  <option value="2025 • 1er cuatrimestre">2025 • 1er cuatrimestre</option>
                  <option value="2025 • 2do cuatrimestre">2025 • 2do cuatrimestre</option>
                  <option value="2024 • 2do cuatrimestre">2024 • 2do cuatrimestre</option>
                </select>
              </div>
              
              <!-- Icono de la materia -->
              <div class="form-group mb-4">
                <label class="form-label">Icono de la materia</label>
                <div class="icon-selector">
                  <div class="current-icon" [style.background-color]="newMateria.color">
                    {{ newMateria.icon }}
                  </div>
                  <div class="icon-dropdown">
                    <button class="change-icon-btn" type="button" (click)="toggleIconDropdown()">
                      Elegir icono
                    </button>
                    <div class="icon-options" *ngIf="showIconDropdown">
                      <div 
                        *ngFor="let icon of iconOptions"
                        class="icon-option"
                        (click)="selectIcon(icon)">
                        {{ icon }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Color de la serie -->
              <div class="form-group mb-4">
                <label class="form-label">Color de la serie</label>
                <div class="color-palette">
                  <div 
                    *ngFor="let color of colorOptions" 
                    class="color-option"
                    [class.selected]="newMateria.color === color"
                    [style.background-color]="color"
                    (click)="selectNewColor(color)">
                  </div>
                </div>
              </div>
              
              <!-- Objetivos -->
              <div class="form-group mb-4">
                <label class="form-label text-muted">Objetivos (opcional)</label>
                <textarea 
                  class="form-control modal-input" 
                  rows="3"
                  [(ngModel)]="newMateria.objetivos"
                  placeholder="Ej: Aprobación con 8+, reforzar integrales, práctica semanal..."></textarea>
              </div>
              
              <!-- Notas de exámenes -->
              <div class="form-group mb-4">
                <label class="form-label">Notas de exámenes</label>
                <p class="exam-subtitle">Registra los dos parciales y el final para calcular tu rendimiento.</p>
                
                <div class="exam-row mb-2">
                  <label class="exam-label">Parcial 1</label>
                  <div class="exam-inputs">
                    <input 
                      type="number" 
                      class="form-control exam-input modal-input" 
                      [(ngModel)]="newMateria.parcial1"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder="Ej: 7.5">
                    <input type="date" class="form-control exam-date-input modal-input">
                  </div>
                </div>
                
                <div class="exam-row mb-2">
                  <label class="exam-label">Parcial 2</label>
                  <div class="exam-inputs">
                    <input 
                      type="number" 
                      class="form-control exam-input modal-input" 
                      [(ngModel)]="newMateria.parcial2"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder="Ej: 7.5">
                    <input type="date" class="form-control exam-date-input modal-input">
                  </div>
                </div>
                
                <div class="exam-row">
                  <label class="exam-label">Final</label>
                  <div class="exam-inputs">
                    <input 
                      type="number" 
                      class="form-control exam-input modal-input" 
                      [(ngModel)]="newMateria.final"
                      step="0.1"
                      min="0"
                      max="10"
                      placeholder="Ej: 7.5">
                    <input type="date" class="form-control exam-date-input modal-input">
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-5">
              <!-- Resumen -->
              <div class="summary-card">
                <h4 class="summary-title">Resumen</h4>
                <div class="summary-content">
                  <div class="summary-row">
                    <span class="summary-label">Materia</span>
                    <span class="summary-value">{{ newMateria.name || 'Sin nombre' }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Icono</span>
                    <div class="summary-icon" [style.background-color]="newMateria.color">
                      {{ newMateria.icon }}
                    </div>
                    <span class="summary-label">Color</span>
                    <div class="summary-color" [style.background-color]="newMateria.color"></div>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Notas</span>
                    <span class="summary-value">P1: {{ newMateria.parcial1 || '—' }} — P2: {{ newMateria.parcial2 || '—' }} — Final: {{ newMateria.final || '—' }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Vista previa en gráfico -->
              <div class="chart-preview">
                <h5 class="chart-title">Vista previa en gráfico</h5>
                <div class="chart-container">
                  <svg width="100%" height="200" viewBox="0 0 300 200">
                    <!-- Grid lines -->
                    <defs>
                      <pattern id="newGrid" width="30" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#newGrid)" />
                    
                    <!-- Chart line -->
                    <polyline
                      [attr.points]="getNewChartPoints()"
                      fill="none"
                      [attr.stroke]="newMateria.color"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
                    
                    <!-- Data points -->
                    <circle 
                      *ngFor="let point of getNewDataPoints(); let i = index"
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="4"
                      [attr.fill]="newMateria.color"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeAddModal()">Cancelar</button>
          <button class="btn btn-warning" (click)="saveNewMateria()">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Editar Materia -->
    <div class="modal-overlay" *ngIf="showEditModal" (click)="closeModal()">
      <div class="edit-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Editar materia</h3>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        
        <div class="modal-body">
          <div class="row">
            <div class="col-md-7">
              <!-- Nombre de la materia -->
              <div class="form-group mb-4">
                <label class="form-label">Nombre de la materia</label>
                <input 
                  type="text" 
                  class="form-control modal-input" 
                  [(ngModel)]="editingMateria.name"
                  placeholder="Nombre de la materia">
              </div>
              
              <!-- Cuatrimestre -->
              <div class="form-group mb-4">
                <label class="form-label">Cuatrimestre</label>
                <select class="form-control modal-input" [(ngModel)]="editingMateria.cuatrimestre">
                  <option value="2025 • 1C">2025 • 1C</option>
                  <option value="2025 • 2C">2025 • 2C</option>
                  <option value="2024 • 2C">2024 • 2C</option>
                </select>
              </div>
              
              <!-- Icono de la materia -->
              <div class="form-group mb-4">
                <label class="form-label">Icono de la materia</label>
                <div class="icon-selector">
                  <div class="current-icon" [style.background-color]="editingMateria.color">
                    {{ editingMateria.icon }}
                  </div>
                  <button class="change-icon-btn" type="button">Cambiar</button>
                </div>
              </div>
              
              <!-- Color de la serie -->
              <div class="form-group mb-4">
                <label class="form-label">Color de la serie</label>
                <div class="color-palette">
                  <div 
                    *ngFor="let color of colorOptions" 
                    class="color-option"
                    [class.selected]="editingMateria.color === color"
                    [style.background-color]="color"
                    (click)="selectColor(color)">
                  </div>
                </div>
              </div>
              
              <!-- Objetivos -->
              <div class="form-group mb-4">
                <label class="form-label text-muted">Objetivos (opcional)</label>
                <textarea 
                  class="form-control modal-input" 
                  rows="3"
                  [(ngModel)]="editingMateria.objetivos"
                  placeholder="Aprobar con 8+, reforzar integrales, práctica semanal..."></textarea>
              </div>
              
              <!-- Notas de exámenes -->
              <div class="form-group mb-4">
                <label class="form-label">Notas de exámenes</label>
                
                <div class="exam-row mb-2">
                  <label class="exam-label">Parcial 1</label>
                  <div class="exam-inputs">
                    <input 
                      type="number" 
                      class="form-control exam-input modal-input" 
                      [(ngModel)]="editingMateria.parcial1"
                      step="0.1"
                      min="0"
                      max="10">
                    <input type="date" class="form-control exam-date-input modal-input">
                  </div>
                </div>
                
                <div class="exam-row mb-2">
                  <label class="exam-label">Parcial 2</label>
                  <div class="exam-inputs">
                    <input 
                      type="number" 
                      class="form-control exam-input modal-input" 
                      [(ngModel)]="editingMateria.parcial2"
                      step="0.1"
                      min="0"
                      max="10">
                    <input type="date" class="form-control exam-date-input modal-input">
                  </div>
                </div>
                
                <div class="exam-row">
                  <label class="exam-label">Final</label>
                  <div class="exam-inputs">
                    <input 
                      type="number" 
                      class="form-control exam-input modal-input" 
                      [(ngModel)]="editingMateria.final"
                      step="0.1"
                      min="0"
                      max="10">
                    <input type="date" class="form-control exam-date-input modal-input">
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <!-- Resumen -->
              <div class="summary-card">
                <h4 class="summary-title">Resumen</h4>
                <div class="summary-content">
                  <div class="summary-row">
                    <span class="summary-label">Materia</span>
                    <span class="summary-value">{{ editingMateria.name }}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Icono</span>
                    <div class="summary-icon" [style.background-color]="editingMateria.color">
                      {{ editingMateria.icon }}
                    </div>
                    <span class="summary-label">Color</span>
                    <div class="summary-color" [style.background-color]="editingMateria.color"></div>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Notas</span>
                    <span class="summary-value">P1: {{ editingMateria.parcial1 || 0 }} — P2: {{ editingMateria.parcial2 || 0 }} — Final: {{ editingMateria.final || 0 }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Vista previa en gráfico -->
              <div class="chart-preview">
                <h5 class="chart-title">Vista previa en gráfico</h5>
                <div class="chart-container">
                  <svg width="100%" height="200" viewBox="0 0 300 200">
                    <!-- Grid lines -->
                    <defs>
                      <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    <!-- Chart line -->
                    <polyline
                      [attr.points]="getChartPoints()"
                      fill="none"
                      [attr.stroke]="editingMateria.color"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
                    
                    <!-- Data points -->
                    <circle 
                      *ngFor="let point of getDataPoints(); let i = index"
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="4"
                      [attr.fill]="editingMateria.color"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
          <button class="btn btn-warning" (click)="saveMateria()">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="closeDeleteModal()">
      <div class="delete-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Eliminar materia</h3>
          <button class="close-btn" (click)="closeDeleteModal()">×</button>
        </div>
        
        <div class="modal-body">
          <div class="delete-confirmation">
            <div class="warning-icon">⚠️</div>
            <h4>¿Estás seguro de que quieres eliminar esta materia?</h4>
            <p class="delete-warning">
              Se eliminará permanentemente <strong>{{ materiaToDelete?.name }}</strong> 
              y todos los datos asociados, incluyendo:
            </p>
            <ul class="delete-items">
              <li>Todas las sesiones de estudio registradas</li>
              <li>Notas de exámenes</li>
              <li>Objetivos y configuración</li>
            </ul>
            <p class="delete-note">Esta acción no se puede deshacer.</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeDeleteModal()">Cancelar</button>
          <button class="btn btn-danger" (click)="deleteMateria()">Eliminar materia</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .materias-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: 100vh;
      margin-left: 250px;
      margin-left: 250px;
    }

    .materias-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .materias-title {
      font-size: 28px;
      font-weight: 600;
      color: #1F2937;
      margin: 0;
    }

    .header-controls {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .search-input {
      padding: 12px 16px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-size: 14px;
      width: 250px;
    }

    .add-button {
      background: #F59E0B;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .add-button:hover {
      background: #D97706;
    }

    .materias-table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .materias-table {
      width: 100%;
      border-collapse: collapse;
    }

    .materias-table-header {
      background: #F9FAFB;
    }

    .materias-table-header th {
      padding: 16px 24px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #E5E7EB;
    }

    .materias-table-row {
      border-bottom: 1px solid #F3F4F6;
      transition: background-color 0.2s ease;
    }

    .materias-table-row:hover {
      background: #F9FAFB;
    }

    .materias-table-row td {
      padding: 16px 24px;
      vertical-align: middle;
    }

    .materia-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .materia-color-indicator {
      width: 4px;
      height: 40px;
      border-radius: 2px;
    }

    .materia-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
    }

    .materia-name {
      font-weight: 600;
      color: #1F2937;
    }

    .cuatrimestre-cell {
      color: #6B7280;
      font-size: 14px;
    }

    .tiempo-cell {
      font-family: 'SF Mono', monospace;
    }

    .tiempo-badge {
      background: #F3F4F6;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
    }

    .notas-cell {
      font-family: 'SF Mono', monospace;
      font-size: 14px;
      color: #374151;
    }

    .acciones-cell {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edit-btn {
      background: #EBF8FF;
      color: #2563EB;
    }

    .edit-btn:hover {
      background: #DBEAFE;
    }

    .delete-btn {
      background: #FEF2F2;
      color: #DC2626;
    }

    .delete-btn:hover {
      background: #FEE2E2;
    }

    .materias-tip {
      padding: 16px 24px;
      background: #F9FAFB;
      border-top: 1px solid #E5E7EB;
      font-size: 14px;
      color: #6B7280;
      font-style: italic;
    }

    /* Modal Styles */
    .modal-header {
      padding: 24px 24px 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E5E7EB;
      margin-bottom: 24px;
    }

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #1F2937;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #6B7280;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    .close-btn:hover {
      background: #F3F4F6;
    }

    .modal-body {
      padding: 0 24px 24px 24px;
    }

    .modal-subtitle {
      color: #6B7280;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .row {
      display: flex;
      gap: 24px;
    }

    .col-md-7 {
      flex: 0 0 58.333333%;
    }

    .col-md-5, .col-md-6 {
      flex: 1;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .form-label.text-muted {
      color: #6B7280;
      font-weight: 500;
    }

    .modal-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-size: 14px;
      color: #374151;
      background: white;
      transition: border-color 0.2s ease;
    }

    .modal-input:focus {
      outline: none;
      border-color: #F59E0B;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    .icon-selector {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .current-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .icon-dropdown {
      position: relative;
    }

    .change-icon-btn {
      background: #F3F4F6;
      border: 1px solid #D1D5DB;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .change-icon-btn:hover {
      background: #E5E7EB;
    }

    .icon-options {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      padding: 8px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }

    .icon-option {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .icon-option:hover {
      background: #F3F4F6;
    }

    .color-palette {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .color-option {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .color-option:hover {
      transform: scale(1.1);
    }

    .color-option.selected {
      border-color: #1F2937;
      transform: scale(1.1);
    }

    .exam-subtitle {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 16px;
    }

    .exam-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .exam-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      min-width: 80px;
    }

    .exam-inputs {
      display: flex;
      gap: 12px;
      flex: 1;
    }

    .exam-input {
      width: 100px;
    }

    .exam-date-input {
      width: 150px;
    }

    .summary-card {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .summary-title {
      font-size: 16px;
      font-weight: 600;
      color: #1F2937;
      margin: 0 0 16px 0;
    }

    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .summary-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .summary-label {
      font-size: 14px;
      color: #6B7280;
      min-width: 60px;
    }

    .summary-value {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }

    .summary-icon {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
    }

    .summary-color {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      border: 1px solid #D1D5DB;
    }

    .chart-preview {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 20px;
    }

    .chart-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 16px 0;
    }

    .chart-container {
      background: white;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid #E5E7EB;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid #E5E7EB;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-secondary {
      background: #F3F4F6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #E5E7EB;
    }

    .btn-warning {
      background: #F59E0B;
      color: white;
    }

    .btn-warning:hover {
      background: #D97706;
    }

    .btn-danger {
      background: #DC2626;
      color: white;
    }

    .btn-danger:hover {
      background: #B91C1C;
    }

    .delete-confirmation {
      text-align: center;
      padding: 20px;
    }

    .warning-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .delete-confirmation h4 {
      font-size: 18px;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 12px;
    }

    .delete-warning {
      color: #6B7280;
      margin-bottom: 16px;
    }

    .delete-items {
      text-align: left;
      color: #6B7280;
      margin: 16px 0;
      padding-left: 20px;
    }

    .delete-note {
      color: #DC2626;
      font-weight: 500;
      font-size: 14px;
    }
  `]
})
export class MateriasComponent {
  searchTerm = '';
  showEditModal = false;
  showDeleteModal = false;
  showAddModal = false;
  showIconDropdown = false;
  materiaToDelete: any = null;
  editingMateria: any = {};
  newMateria: any = {
    name: '',
    icon: '📚',
    color: '#F59E0B',
    cuatrimestre: '2025 • 1er cuatrimestre',
    parcial1: null,
    parcial2: null,
    final: null,
    objetivos: ''
  };
  
  colorOptions = [
    '#F59E0B', // yellow
    '#9CA3AF', // gray
    '#8B5CF6', // purple
    '#10B981', // green
    '#1F2937', // dark
    '#F87171'  // red
  ];

  iconOptions = [
    '📚', '💻', '📐', '📊', '💰', '🔬', 
    '🎨', '📝', '🌍', '⚗️', '🏛️', '🎵'
  ];
  
  materias: Materia[] = [
    {
      id: 1,
      name: 'Programación',
      icon: '💻',
      color: '#D2691E',
      cuatrimestre: '2025 • 1C',
      tiempoInvertido: '13:58:05',
      notas: '7.0 • 7.5 • 8.5',
      parcial1: 7.0,
      parcial2: 7.5,
      final: 8.5,
      objetivos: 'Aprobar con 8+, reforzar algoritmos de ordenamiento'
    },
    {
      id: 2,
      name: 'Cálculo',
      icon: '📐',
      color: '#48BB78',
      cuatrimestre: '2025 • 1C',
      tiempoInvertido: '09:17:54',
      notas: '6.0 • 7.0 • 8.0',
      parcial1: 6.0,
      parcial2: 7.0,
      final: 8.0,
      objetivos: 'Reforzar integrales, práctica semanal'
    },
    {
      id: 3,
      name: 'Estadística',
      icon: '📊',
      color: '#9F7AEA',
      cuatrimestre: '2025 • 1C',
      tiempoInvertido: '08:15:57',
      notas: '5.5 • 6.5 • 7.5',
      parcial1: 5.5,
      parcial2: 6.5,
      final: 7.5,
      objetivos: 'Mejorar comprensión de distribuciones'
    },
    {
      id: 4,
      name: 'Economía',
      icon: '💰',
      color: '#38A169',
      cuatrimestre: '2025 • 1C',
      tiempoInvertido: '07:23:22',
      notas: '7.0 • 8.0 • 9.0',
      parcial1: 7.0,
      parcial2: 8.0,
      final: 9.0,
      objetivos: 'Mantener buen rendimiento'
    }
  ];

  get filteredMaterias() {
    if (!this.searchTerm) {
      return this.materias;
    }
    
    return this.materias.filter(materia => 
      materia.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  openAddModal() {
    this.newMateria = {
      name: '',
      icon: '📚',
      color: '#F59E0B',
      cuatrimestre: '2025 • 1er cuatrimestre',
      parcial1: null,
      parcial2: null,
      final: null,
      objetivos: ''
    };
    this.showAddModal = true;
  }
  
  closeAddModal() {
    this.showAddModal = false;
    this.showIconDropdown = false;
  }
  
  toggleIconDropdown() {
    this.showIconDropdown = !this.showIconDropdown;
  }
  
  selectIcon(icon: string) {
    this.newMateria.icon = icon;
    this.showIconDropdown = false;
  }
  
  selectNewColor(color: string) {
    this.newMateria.color = color;
  }
  
  saveNewMateria() {
    if (!this.newMateria.name.trim()) {
      return;
    }
    
    const newId = Math.max(...this.materias.map(m => m.id), 0) + 1;
    const tiempoInvertido = '00:00:00'; // Default time
    const notas = `${this.newMateria.parcial1 || '—'} • ${this.newMateria.parcial2 || '—'} • ${this.newMateria.final || '—'}`;
    
    const materia: Materia = {
      id: newId,
      name: this.newMateria.name,
      icon: this.newMateria.icon,
      color: this.newMateria.color,
      cuatrimestre: this.newMateria.cuatrimestre,
      tiempoInvertido: tiempoInvertido,
      notas: notas,
      parcial1: this.newMateria.parcial1 || 0,
      parcial2: this.newMateria.parcial2 || 0,
      final: this.newMateria.final || 0,
      objetivos: this.newMateria.objetivos
    };
    
    this.materias.push(materia);
    this.closeAddModal();
  }
  
  editMateria(materia: Materia) {
    this.editingMateria = { ...materia };
    this.showEditModal = true;
  }
  
  confirmDelete(materia: Materia) {
    this.materiaToDelete = materia;
    this.showDeleteModal = true;
  }
  
  deleteMateria() {
    if (this.materiaToDelete) {
      this.materias = this.materias.filter(m => m.id !== this.materiaToDelete.id);
      this.closeDeleteModal();
    }
  }
  
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.materiaToDelete = null;
  }
  
  closeModal() {
    this.showEditModal = false;
    this.editingMateria = {};
  }
  
  selectColor(color: string) {
    this.editingMateria.color = color;
  }
  
  saveMateria() {
    const index = this.materias.findIndex(m => m.id === this.editingMateria.id);
    if (index !== -1) {
      // Update notas string
      this.editingMateria.notas = `${this.editingMateria.parcial1} • ${this.editingMateria.parcial2} • ${this.editingMateria.final}`;
      this.materias[index] = { ...this.editingMateria };
    }
    this.closeModal();
  }
  
  getNewChartPoints(): string {
    const points = this.getNewDataPoints();
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }
  
  getNewDataPoints() {
    const parcial1 = this.newMateria.parcial1 || 0;
    const parcial2 = this.newMateria.parcial2 || 0;
    const final = this.newMateria.final || 0;
    
    return [
      { x: 50, y: 180 - (parcial1 * 15) },
      { x: 150, y: 180 - (parcial2 * 15) },
      { x: 250, y: 180 - (final * 15) }
    ];
  }
  
  getChartPoints(): string {
    const points = this.getDataPoints();
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }
  
  getDataPoints() {
    const parcial1 = this.editingMateria.parcial1 || 0;
    const parcial2 = this.editingMateria.parcial2 || 0;
    const final = this.editingMateria.final || 0;
    
    return [
      { x: 50, y: 180 - (parcial1 * 15) },
      { x: 150, y: 180 - (parcial2 * 15) },
      { x: 250, y: 180 - (final * 15) }
    ];
  }
}