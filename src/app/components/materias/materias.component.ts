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
}

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="materias-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0" style="color: var(--text-primary); font-weight: 600;">Gestión de materias</h2>
        <button class="btn btn-warning px-4 py-2" style="border-radius: 8px; font-weight: 500;">
          Añadir
        </button>
      </div>
      
      <div class="mb-4">
        <input 
          type="text" 
          class="form-control search-input" 
          placeholder="Buscar materia..."
          [(ngModel)]="searchTerm"
          style="max-width: 300px; border-radius: 8px; border: 1px solid var(--border-color); padding: 0.75rem 1rem;">
      </div>
      
      <div class="table-container">
        <table class="table table-borderless">
          <thead>
            <tr class="table-header">
              <th style="color: var(--text-secondary); font-weight: 500; font-size: 0.875rem; padding: 1rem 1.5rem;">Materia</th>
              <th style="color: var(--text-secondary); font-weight: 500; font-size: 0.875rem; padding: 1rem 1.5rem;">Cuatrimestre</th>
              <th style="color: var(--text-secondary); font-weight: 500; font-size: 0.875rem; padding: 1rem 1.5rem;">Tiempo invertido</th>
              <th style="color: var(--text-secondary); font-weight: 500; font-size: 0.875rem; padding: 1rem 1.5rem;">Notas (P1 • P2 • Final)</th>
              <th style="color: var(--text-secondary); font-weight: 500; font-size: 0.875rem; padding: 1rem 1.5rem;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let materia of filteredMaterias" class="materia-row">
              <td class="d-flex align-items-center" style="padding: 1.5rem;">
                <div class="materia-icon me-3" [style.background-color]="materia.color">
                  {{ materia.icon }}
                </div>
                <span style="font-weight: 500; color: var(--text-primary);">{{ materia.name }}</span>
              </td>
              <td style="padding: 1.5rem; color: var(--text-secondary);">{{ materia.cuatrimestre }}</td>
              <td style="padding: 1.5rem;">
                <span class="time-badge">{{ materia.tiempoInvertido }}</span>
              </td>
              <td style="padding: 1.5rem; color: var(--text-secondary);">{{ materia.notas }}</td>
              <td style="padding: 1.5rem;">
                <div class="d-flex gap-3">
                  <button class="action-btn edit-btn">Editar</button>
                  <button class="action-btn delete-btn">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-3">
        <small style="color: var(--text-secondary);">
          Tip: desde "Editar" puedes abrir el formulario de Agregar/Editar materia (el que diseñamos) con los datos precargados.
        </small>
      </div>
    </div>
  `
})
export class MateriasComponent {
  searchTerm = '';
  
  materias: Materia[] = [
    {
      id: 1,
      name: 'Programación',
      icon: '💻',
      color: '#D2691E',
      cuatrimestre: '2025 • 1C',
      tiempoInvertido: '13:58:05',
      notas: '7.0 • 7.5 • 8.5'
    },
    {
      id: 2,
      name: 'Cálculo',
      icon: '📐',
      color: '#48BB78',
      cuatrimestre: '2025 • 1C',
      tiempoInvertido: '09:17:54',
      notas: '6.0 • 7.0 • 8.0'
    },
    {
      id: 3,
      name: 'Estadística',
      icon: '📊',
      color: '#9F7AEA',
      cuatrimestre: '2025 • 1C',
      tiempoInvertido: '08:15:57',
      notas: '5.5 • 6.5 • 7.5'
    },
    {
      id: 4,
      name: 'Economía',
      icon: '💰',
      color: '#38A169',
      cuatrimestre: '2025 • 1C',
      tiempoInvertido: '07:23:22',
      notas: '7.0 • 8.0 • 9.0'
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
}