import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerService } from '../../services/timer.service';
import { SessionService } from '../../services/session.service';

interface StudySession {
  id: number;
  description: string;
  subject: string;
  activity: string;
  startTime: string;
  endTime: string;
  duration: string;
  subjectColor: string;
}

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="timesheet-container">
      <h1 class="timesheet-title">Timesheet</h1>
      <div class="week-selector">Semana: 26 Ago - 1 Sep</div>

      <div class="timer-section">
        <div class="timer-row">
          <div class="timer-question">
            <input 
              type="text" 
              class="timer-input description-input" 
              [(ngModel)]="currentDescription"
              placeholder="¿Qué estás estudiando?"
              [disabled]="isRunning">
          </div>
          <div class="timer-selects">
            <select class="timer-input subject-select" [(ngModel)]="currentSubject" [disabled]="isRunning">
              <option value="">Materia</option>
              <option value="programacion">Programación</option>
              <option value="calculo">Cálculo</option>
              <option value="estadistica">Estadística</option>
              <option value="economia">Economía</option>
              <option value="fisica">Física</option>
            </select>
            <select class="timer-input activity-select" [(ngModel)]="currentActivity" [disabled]="isRunning">
              <option value="">Actividad</option>
              <option value="teoria">Teoría</option>
              <option value="practica">Práctica</option>
              <option value="repaso">Repaso</option>
            </select>
          </div>
          <div class="timer-controls">
            <div class="timer-display">{{ formattedTime }}</div>
            <button 
              class="play-button" 
              (click)="toggleTimer()"
              [disabled]="!canStartTimer()">
              {{ isRunning ? '⏸' : '▶' }}
            </button>
          </div>
        </div>
      </div>

      <div class="sessions-section">
        <h3 class="sessions-title">Esta semana</h3>
        <div class="sessions-table-container">
          <table class="sessions-table">
            <thead>
              <tr class="sessions-table-header">
                <th>DESCRIPCIÓN</th>
                <th>MATERIA / ACTIVIDAD</th>
                <th>INICIO - FIN</th>
                <th>DURACIÓN</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let session of sessions" class="sessions-table-row">
                <td class="description-cell">{{ session.description }}</td>
                <td class="subject-cell">
                  <span class="subject-tag" [ngClass]="'subject-' + session.subject">
                    <span class="subject-color-dot">■</span>
                    {{ getSubjectDisplayName(session.subject) }} • {{ getActivityDisplayName(session.activity) }}
                  </span>
                </td>
                <td class="time-cell">{{ session.startTime }} - {{ session.endTime }}</td>
                <td class="duration-cell">{{ session.duration }}</td>
              </tr>
              <tr *ngIf="sessions.length === 0">
                <td colspan="4" class="empty-state">
                  <p>No hay sesiones registradas esta semana</p>
                  <small>Inicia el timer para comenzar a registrar tu tiempo de estudio</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timesheet-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: 100vh;
      margin-left: 250px;
    }

    .timesheet-title {
      font-size: 28px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 8px 0;
    }

    .week-selector {
      color: #718096;
      font-size: 14px;
      margin: 0 0 32px 0;
    }

    .timer-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .timer-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 24px;
      align-items: end;
    }

    .timer-question {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .timer-input {
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      font-size: 14px;
      color: #4a5568;
      transition: border-color 0.2s ease;
    }

    .timer-input:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }

    .description-input {
      width: 100%;
    }

    .timer-selects {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .subject-select, .activity-select {
      min-width: 140px;
    }

    .timer-controls {
      display: flex;
      align-items: center;
      gap: 16px;
      justify-content: center;
    }

    .timer-display {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
      font-size: 24px;
      font-weight: 600;
      color: #2d3748;
      padding: 12px 20px;
      background: #f7fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      min-width: 120px;
      text-align: center;
    }

    .play-button {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #F59E0B;
      color: white;
      border: none;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .play-button:hover:not(:disabled) {
      background: #D97706;
      transform: scale(1.05);
    }

    .play-button:disabled {
      background: #cbd5e0;
      cursor: not-allowed;
      transform: none;
    }

    .sessions-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .sessions-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 16px 0;
    }

    .sessions-table-container {
      overflow-x: auto;
    }

    .sessions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .sessions-table-header {
      background: #f7fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .sessions-table-header th {
      padding: 16px 24px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .sessions-table-row {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.2s ease;
    }

    .sessions-table-row:hover {
      background: #f8fafc;
    }

    .sessions-table-row:last-child {
      border-bottom: none;
    }

    .sessions-table-row td {
      padding: 16px 24px;
    }

    .description-cell {
      color: #2d3748;
      font-weight: 500;
    }

    .subject-cell {
      color: #4a5568;
    }

    .subject-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      background: #f7fafc;
      border-radius: 6px;
      font-size: 13px;
    }

    .subject-color-dot {
      font-size: 12px;
    }

    .subject-programacion .subject-color-dot {
      color: #D2691E;
    }

    .subject-calculo .subject-color-dot {
      color: #48BB78;
    }

    .subject-estadistica .subject-color-dot {
      color: #9F7AEA;
    }

    .subject-economia .subject-color-dot {
      color: #38A169;
    }

    .subject-fisica .subject-color-dot {
      color: #4299E1;
    }

    .time-cell {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
      font-size: 13px;
      color: #718096;
      background: #f7fafc;
      border-radius: 4px;
      text-align: center;
    }

    .duration-cell {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
      font-size: 13px;
      color: #4a5568;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #718096;
    }

    .empty-state p {
      margin: 0 0 8px 0;
      font-size: 16px;
    }

    .empty-state small {
      font-size: 14px;
      color: #a0aec0;
    }

    @media (max-width: 768px) {
      .timer-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .timer-controls {
        justify-content: flex-start;
      }

      .sessions-table-container {
        overflow-x: scroll;
      }

      .sessions-table {
        min-width: 600px;
      }
    }
  `]
})
export class TimesheetComponent {
  currentDescription = '';
  currentSubject = '';
  currentActivity = '';
  isRunning = false;
  currentTime = 0;
  private timerInterval?: any;
  
  sessions: StudySession[] = [
    {
      id: 1,
      description: 'Repaso listas enlazadas',
      subject: 'programacion',
      activity: 'teoria',
      startTime: '09:10',
      endTime: '10:12',
      duration: '01:02:00',
      subjectColor: '#D2691E'
    },
    {
      id: 2,
      description: 'Integrales por partes',
      subject: 'calculo',
      activity: 'practica',
      startTime: '10:30',
      endTime: '11:08',
      duration: '00:38:00',
      subjectColor: '#48BB78'
    },
    {
      id: 3,
      description: 'Ejercicios de cinemática',
      subject: 'fisica',
      activity: 'practica',
      startTime: '14:15',
      endTime: '15:45',
      duration: '01:30:00',
      subjectColor: '#4299E1'
    },
    {
      id: 4,
      description: 'Lectura capítulo 5 - Algoritmos de ordenamiento',
      subject: 'programacion',
      activity: 'teoria',
      startTime: '16:00',
      endTime: '17:25',
      duration: '01:25:00',
      subjectColor: '#D2691E'
    },
    {
      id: 5,
      description: 'Repaso derivadas parciales',
      subject: 'calculo',
      activity: 'repaso',
      startTime: '19:30',
      endTime: '20:15',
      duration: '00:45:00',
      subjectColor: '#48BB78'
    },
    {
      id: 6,
      description: 'Laboratorio - Movimiento rectilíneo',
      subject: 'fisica',
      activity: 'practica',
      startTime: '08:00',
      endTime: '09:30',
      duration: '01:30:00',
      subjectColor: '#4299E1'
    }
  ];

  constructor(
    private timerService: TimerService,
    private sessionService: SessionService
  ) {
    this.timerService.timer$.subscribe(time => {
      this.currentTime = time;
    });
    
    this.timerService.isRunning$.subscribe(running => {
      this.isRunning = running;
    });
  }

  get formattedTime(): string {
    return this.timerService.formatTime(this.currentTime);
  }

  canStartTimer(): boolean {
    return this.currentDescription.trim() !== '' && 
           this.currentSubject !== '' && 
           this.currentActivity !== '';
  }

  toggleTimer() {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (!this.canStartTimer()) return;
    this.timerService.start();
  }

  stopTimer() {
    const sessionData = this.timerService.stop();
    
    if (sessionData && sessionData.duration > 0) {
      const newSession = {
        description: this.currentDescription,
        subject: this.currentSubject,
        activity: this.currentActivity,
        startTime: this.formatTime(sessionData.startTime!),
        endTime: this.formatTime(sessionData.endTime),
        duration: this.timerService.formatTime(sessionData.duration),
        subjectColor: this.getSubjectColor(this.currentSubject)
      };
      
      this.sessionService.addSession(newSession);
      this.sessions = this.sessionService.getSessions();
      
      // Reset form
      this.currentDescription = '';
      this.currentSubject = '';
      this.currentActivity = '';
    }
    
    this.timerService.reset();
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  getSubjectDisplayName(subject: string): string {
    const names: { [key: string]: string } = {
      'programacion': 'Programación',
      'calculo': 'Cálculo',
      'estadistica': 'Estadística',
      'economia': 'Economía',
      'fisica': 'Física'
    };
    return names[subject] || subject;
  }

  getActivityDisplayName(activity: string): string {
    const names: { [key: string]: string } = {
      'teoria': 'Teoría',
      'practica': 'Práctica',
      'repaso': 'Repaso'
    };
    return names[activity] || activity;
  }

  getSubjectColor(subject: string): string {
    const colorMap: { [key: string]: string } = {
      'programacion': '#D2691E',
      'calculo': '#48BB78',
      'estadistica': '#9F7AEA',
      'economia': '#38A169',
      'fisica': '#4299E1'
    };
    return colorMap[subject] || '#718096';
  }
}