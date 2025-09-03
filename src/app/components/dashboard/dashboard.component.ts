import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChartData {
  subject: string;
  hours: number;
  color: string;
  activities: {
    teoria: number;
    practica: number;
    repaso: number;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2 class="dashboard-title">Dashboard</h2>
        <div class="period-selector">
          <span class="period-label">Período:</span>
          <div class="period-buttons">
            <button 
              class="period-btn" 
              [class.active]="selectedPeriod === 'semana'"
              (click)="selectPeriod('semana')">
              Semana
            </button>
            <button 
              class="period-btn" 
              [class.active]="selectedPeriod === 'mes'"
              (click)="selectPeriod('mes')">
              Mes
            </button>
          </div>
          <div class="date-range">
            <span>26 Ago - 1 Sep 2025</span>
          </div>
          <button class="apply-btn">Aplicar</button>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Performance Académico -->
        <div class="dashboard-card performance-card">
          <h3 class="card-title">Performance académico</h3>
          <div class="performance-content">
            <div class="performance-score">
              <span class="score-label">Promedio:</span>
              <span class="score-value">7.8</span>
            </div>
            <div class="performance-goal">
              <span class="goal-label">Meta 8.0</span>
            </div>
            <div class="performance-bar">
              <div class="performance-progress" [style.width.%]="97.5"></div>
            </div>
          </div>
        </div>

        <!-- Tiempo invertido por semana -->
        <div class="dashboard-card time-chart-card">
          <h3 class="card-title">Tiempo invertido por semana</h3>
          <div class="time-chart">
            <svg width="100%" height="200" viewBox="0 0 400 200">
              <!-- Chart segments -->
              <g transform="translate(200, 100)">
                <path 
                  *ngFor="let segment of pieSegments; let i = index"
                  [attr.d]="segment.path"
                  [attr.fill]="segment.color"
                  [attr.stroke]="'white'"
                  stroke-width="2"/>
              </g>
              <!-- Center text -->
              <text x="200" y="95" text-anchor="middle" class="total-hours-label">Total:</text>
              <text x="200" y="115" text-anchor="middle" class="total-hours-value">35h</text>
            </svg>
            <div class="chart-legend">
              <div *ngFor="let item of chartData" class="legend-item">
                <div class="legend-color" [style.background-color]="item.color"></div>
                <span class="legend-label">{{ getSubjectName(item.subject) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Horas por actividad y materia -->
        <div class="dashboard-card activity-chart-card">
          <h3 class="card-title">Horas por actividad y materia</h3>
          <div class="activity-chart">
            <div class="chart-bars">
              <div *ngFor="let item of chartData" class="bar-group">
                <div class="bar-container">
                  <div class="stacked-bar">
                    <div 
                      class="bar-segment teoria"
                      [style.height.%]="(item.activities.teoria / getMaxHours()) * 100"
                      [style.background-color]="'#60A5FA'">
                    </div>
                    <div 
                      class="bar-segment practica"
                      [style.height.%]="(item.activities.practica / getMaxHours()) * 100"
                      [style.background-color]="'#34D399'">
                    </div>
                    <div 
                      class="bar-segment repaso"
                      [style.height.%]="(item.activities.repaso / getMaxHours()) * 100"
                      [style.background-color]="'#FBBF24'">
                    </div>
                  </div>
                  <div class="bar-total">{{ item.hours.toFixed(1) }}h</div>
                </div>
                <div class="bar-label">{{ getSubjectName(item.subject) }}</div>
              </div>
            </div>
            <div class="activity-legend">
              <span class="activity-label">Actividades</span>
              <div class="legend-items">
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #60A5FA;"></div>
                  <span>Clase</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #34D399;"></div>
                  <span>Estudio</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #FBBF24;"></div>
                  <span>Repaso</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total de horas invertidas por materia -->
        <div class="dashboard-card total-hours-card">
          <h3 class="card-title">Total de horas invertidas por materia</h3>
          <div class="total-hours-chart">
            <div class="simple-bars">
              <div *ngFor="let item of chartData" class="simple-bar-group">
                <div class="simple-bar-container">
                  <div 
                    class="simple-bar"
                    [style.height.%]="(item.hours / getMaxHours()) * 100"
                    [style.background-color]="item.color">
                  </div>
                  <div class="simple-bar-total">{{ item.hours.toFixed(1) }}h</div>
                </div>
                <div class="simple-bar-label">{{ getSubjectName(item.subject) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .dashboard-title {
      font-size: 28px;
      font-weight: 600;
      color: #1F2937;
      margin: 0;
    }

    .period-selector {
      display: flex;
      align-items: center;
      gap: 16px;
      background: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .period-label {
      font-size: 14px;
      color: #6B7280;
      font-weight: 500;
    }

    .period-buttons {
      display: flex;
      background: #F3F4F6;
      border-radius: 8px;
      padding: 4px;
    }

    .period-btn {
      padding: 8px 16px;
      border: none;
      background: transparent;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .period-btn.active {
      background: #F59E0B;
      color: white;
    }

    .date-range {
      font-size: 14px;
      color: #374151;
      padding: 8px 12px;
      background: #F9FAFB;
      border-radius: 6px;
      border: 1px solid #E5E7EB;
    }

    .apply-btn {
      background: #F59E0B;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .apply-btn:hover {
      background: #D97706;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .dashboard-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #E5E7EB;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #1F2937;
      margin: 0 0 20px 0;
    }

    /* Performance Card */
    .performance-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .performance-score {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .score-label {
      font-size: 14px;
      color: #6B7280;
    }

    .score-value {
      font-size: 32px;
      font-weight: 700;
      color: #1F2937;
    }

    .performance-goal {
      font-size: 14px;
      color: #6B7280;
    }

    .performance-bar {
      width: 100%;
      height: 8px;
      background: #F3F4F6;
      border-radius: 4px;
      overflow: hidden;
    }

    .performance-progress {
      height: 100%;
      background: linear-gradient(90deg, #F59E0B 0%, #D97706 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    /* Time Chart (Donut) */
    .time-chart {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .total-hours-label {
      font-size: 12px;
      fill: #6B7280;
      font-weight: 500;
    }

    .total-hours-value {
      font-size: 18px;
      fill: #1F2937;
      font-weight: 700;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .legend-label {
      font-size: 14px;
      color: #374151;
    }

    /* Activity Chart (Stacked Bars) */
    .activity-chart {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .chart-bars {
      display: flex;
      align-items: end;
      gap: 24px;
      height: 200px;
      padding: 0 16px;
    }

    .bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      height: 180px;
    }

    .stacked-bar {
      width: 40px;
      height: 150px;
      background: #F3F4F6;
      border-radius: 4px;
      display: flex;
      flex-direction: column-reverse;
      overflow: hidden;
      position: relative;
    }

    .bar-segment {
      width: 100%;
      transition: height 0.3s ease;
    }

    .bar-total {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
    }

    .bar-label {
      font-size: 12px;
      color: #6B7280;
      text-align: center;
      writing-mode: horizontal-tb;
    }

    .activity-legend {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #F3F4F6;
    }

    .activity-label {
      font-size: 12px;
      color: #6B7280;
      font-weight: 500;
    }

    .legend-items {
      display: flex;
      gap: 16px;
    }

    /* Total Hours Chart (Simple Bars) */
    .total-hours-chart {
      height: 200px;
    }

    .simple-bars {
      display: flex;
      align-items: end;
      gap: 32px;
      height: 180px;
      padding: 0 16px;
    }

    .simple-bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .simple-bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      height: 160px;
    }

    .simple-bar {
      width: 50px;
      background: #D2691E;
      border-radius: 4px 4px 0 0;
      transition: height 0.3s ease;
    }

    .simple-bar-total {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
    }

    .simple-bar-label {
      font-size: 12px;
      color: #6B7280;
      text-align: center;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .dashboard-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .period-selector {
        flex-wrap: wrap;
        gap: 12px;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .time-chart {
        flex-direction: column;
        gap: 16px;
      }

      .chart-bars {
        gap: 16px;
      }

      .simple-bars {
        gap: 20px;
      }
    }
  `]
})
export class DashboardComponent {
  selectedPeriod = 'semana';

  chartData: ChartData[] = [
    {
      subject: 'programacion',
      hours: 13.9,
      color: '#D2691E',
      activities: { teoria: 5.2, practica: 6.1, repaso: 2.6 }
    },
    {
      subject: 'calculo',
      hours: 9.3,
      color: '#48BB78',
      activities: { teoria: 3.1, practica: 4.2, repaso: 2.0 }
    },
    {
      subject: 'estadistica',
      hours: 8.2,
      color: '#8B5CF6',
      activities: { teoria: 2.8, practica: 3.9, repaso: 1.5 }
    },
    {
      subject: 'economia',
      hours: 7.2,
      color: '#10B981',
      activities: { teoria: 2.5, practica: 3.2, repaso: 1.5 }
    }
  ];

  get pieSegments() {
    const total = this.chartData.reduce((sum, item) => sum + item.hours, 0);
    let currentAngle = 0;
    const radius = 80;
    const innerRadius = 50;

    return this.chartData.map(item => {
      const percentage = item.hours / total;
      const angle = percentage * 2 * Math.PI;
      
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = Math.cos(startAngle) * radius;
      const y1 = Math.sin(startAngle) * radius;
      const x2 = Math.cos(endAngle) * radius;
      const y2 = Math.sin(endAngle) * radius;
      
      const x3 = Math.cos(endAngle) * innerRadius;
      const y3 = Math.sin(endAngle) * innerRadius;
      const x4 = Math.cos(startAngle) * innerRadius;
      const y4 = Math.sin(startAngle) * innerRadius;
      
      const largeArc = angle > Math.PI ? 1 : 0;
      
      const path = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');
      
      currentAngle += angle;
      
      return {
        path,
        color: item.color
      };
    });
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
  }

  getSubjectName(subject: string): string {
    const names: { [key: string]: string } = {
      'programacion': 'Programación',
      'calculo': 'Cálculo',
      'estadistica': 'Estadística',
      'economia': 'Economía'
    };
    return names[subject] || subject;
  }

  getMaxHours(): number {
    return Math.max(...this.chartData.map(item => item.hours));
  }
}