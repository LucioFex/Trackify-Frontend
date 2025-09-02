import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

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
      <h1 class="h3 mb-4">Timesheet</h1>
      
      <div class="week-selector mb-4">
        Semana: 26 Ago - 1 Sep
      </div>
      
      <!-- Timer Section -->
      <div class="timer-section">
        <div class="timer-row">
          <div class="timer-question">
            <input 
              type="text" 
              class="timer-input description-input" 
              placeholder="¿Qué estás estudiando?"
              [(ngModel)]="currentDescription">
          </div>
          <div class="timer-selects">
            <select class="timer-input subject-select" [(ngModel)]="currentSubject">
              <option value="">Materia</option>
              <option value="programacion">Programación</option>
              <option value="calculo">Cálculo</option>
              <option value="fisica">Física</option>
            </select>
            <select class="timer-input activity-select" [(ngModel)]="currentActivity">
              <option value="">Actividad</option>
              <option value="teoria">Teoría</option>
              <option value="practica">Práctica</option>
              <option value="repaso">Repaso</option>
            </select>
          </div>
          <div class="timer-controls">
            <div class="timer-display">{{ formatTime(elapsedTime) }}</div>
            <button 
              class="play-button"
              (click)="toggleTimer()"
              [disabled]="!canStartTimer()">
              <span *ngIf="!isRunning">▶</span>
              <span *ngIf="isRunning">⏸</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Sessions List -->
      <div class="sessions-section">
        <h5 class="sessions-title">Esta semana</h5>
        
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
                    <span class="subject-color-dot" [style.background-color]="getSubjectColor(session.subject)">■</span>
                    {{ getSubjectName(session.subject) }} • {{ getActivityName(session.activity) }}
                  </span>
                </td>
                <td class="time-cell">{{ session.startTime }} - {{ session.endTime }}</td>
                <td class="duration-cell">{{ session.duration }}</td>
              </tr>
            </tbody>
          </table>
          
          <div *ngIf="sessions.length === 0" class="empty-state">
            <p>No hay sesiones registradas esta semana</p>
            <small>Inicia tu primera sesión de estudio usando el timer</small>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TimesheetComponent implements OnInit, OnDestroy {
  currentDescription = '';
  currentSubject = '';
  currentActivity = '';
  isRunning = false;
  elapsedTime = 0;
  startTime: Date | null = null;
  
  private timerSubscription?: Subscription;
  
  sessions: StudySession[] = [
    {
      id: 1,
      description: 'Repaso listas enlazadas',
      subject: 'programacion',
      activity: 'teoria',
      startTime: '09:10',
      endTime: '10:12',
      duration: '01:02:00',
      subjectColor: '#8B4513'
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
      subjectColor: '#8B4513'
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

  ngOnInit() {
    // Componente inicializado
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  canStartTimer(): boolean {
    return this.currentDescription.trim() !== '' && 
           this.currentSubject !== '' && 
           this.currentActivity !== '';
  }

  toggleTimer() {
    if (!this.canStartTimer()) return;
    
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.startTime = new Date();
    this.elapsedTime = 0;
    
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime++;
    });
  }

  stopTimer() {
    this.isRunning = false;
    
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    if (this.startTime && this.elapsedTime > 0) {
      this.saveSession();
    }
    
    this.resetTimer();
  }

  resetTimer() {
    this.elapsedTime = 0;
    this.startTime = null;
    this.currentDescription = '';
    this.currentSubject = '';
    this.currentActivity = '';
  }

  saveSession() {
    if (!this.startTime) return;
    
    const endTime = new Date();
    const newSession: StudySession = {
      id: this.sessions.length + 1,
      description: this.currentDescription,
      subject: this.currentSubject,
      activity: this.currentActivity,
      startTime: this.formatTimeOnly(this.startTime),
      endTime: this.formatTimeOnly(endTime),
      duration: this.formatTime(this.elapsedTime),
      subjectColor: this.getSubjectColor(this.currentSubject)
    };
    
    this.sessions.unshift(newSession);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  formatTimeOnly(date: Date): string {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  getSubjectName(subject: string): string {
    const subjects: { [key: string]: string } = {
      'programacion': 'Programación',
      'calculo': 'Cálculo',
      'fisica': 'Física'
    };
    return subjects[subject] || subject;
  }

  getActivityName(activity: string): string {
    const activities: { [key: string]: string } = {
      'teoria': 'Teoría',
      'practica': 'Práctica',
      'repaso': 'Repaso'
    };
    return activities[activity] || activity;
  }

  getSubjectColor(subject: string): string {
    const colors: { [key: string]: string } = {
      'programacion': '#8B4513',
      'calculo': '#48BB78',
      'fisica': '#4299E1'
    };
    return colors[subject] || '#6B7280';
  }
}