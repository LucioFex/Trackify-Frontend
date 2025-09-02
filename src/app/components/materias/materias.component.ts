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
          <button class="add-button">Añadir</button>
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
  `
})
export class MateriasComponent {
  searchTerm = '';
  showEditModal = false;
  showDeleteModal = false;
  materiaToDelete: any = null;
  editingMateria: any = {};
  
  colorOptions = [
    '#D2691E', // brown
    '#9F7AEA', // purple
    '#48BB78', // green
    '#2D3748', // dark gray
    '#E53E3E', // red
    '#718096'  // gray
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