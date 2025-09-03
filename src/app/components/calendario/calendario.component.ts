import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarEvent {
  id: number;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  duration: string;
  color: string;
  day: number;
  startHour: number;
  endHour: number;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calendario-container">
      <div class="calendario-header">
        <h2 class="calendario-title">Calendario</h2>
        <div class="week-navigation">
          <button class="nav-btn" (click)="previousWeek()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 12l-4-4 4-4v8z"/>
            </svg>
          </button>
          <button class="nav-btn" (click)="nextWeek()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 4l4 4-4 4V4z"/>
            </svg>
          </button>
          <span class="week-range">Semana: 26 Ago - 1 Sep 2025</span>
          <div class="today-indicator">Hoy</div>
        </div>
      </div>

      <div class="calendar-grid">
        <!-- Time column -->
        <div class="time-column">
          <div class="time-header"></div>
          <div *ngFor="let hour of timeSlots" class="time-slot">
            {{ hour }}
          </div>
        </div>

        <!-- Day columns -->
        <div *ngFor="let day of weekDays; let dayIndex = index" class="day-column">
          <div class="day-header" [class.today]="day.isToday">
            <div class="day-name">{{ day.name }}</div>
            <div class="day-number">{{ day.number }}</div>
          </div>
          
          <div class="day-content">
            <div *ngFor="let hour of timeSlots; let hourIndex = index" 
                 class="hour-slot"
                 [class.current-hour]="isCurrentHour(hourIndex) && day.isToday">
            </div>
            
            <!-- Events -->
            <div *ngFor="let event of getEventsForDay(dayIndex)" 
                 class="calendar-event"
                 [style.background-color]="event.color"
                 [style.top.px]="getEventTop(event)"
                 [style.height.px]="getEventHeight(event)">
              <div class="event-content">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-duration">{{ event.duration }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendario-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: 100vh;
      margin-left: 250px;
    }

    .calendario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .calendario-title {
      font-size: 28px;
      font-weight: 600;
      color: #1F2937;
      margin: 0;
    }

    .week-navigation {
      display: flex;
      align-items: center;
      gap: 16px;
      background: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-btn {
      background: none;
      border: none;
      color: #6B7280;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .nav-btn:hover {
      background: #F3F4F6;
      color: #374151;
    }

    .week-range {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }

    .today-indicator {
      background: #F59E0B;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: 80px repeat(7, 1fr);
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #E5E7EB;
    }

    .time-column {
      background: #F9FAFB;
      border-right: 1px solid #E5E7EB;
    }

    .time-header {
      height: 60px;
      border-bottom: 1px solid #E5E7EB;
    }

    .time-slot {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #6B7280;
      border-bottom: 1px solid #F3F4F6;
      font-family: 'SF Mono', monospace;
    }

    .day-column {
      position: relative;
      border-right: 1px solid #E5E7EB;
    }

    .day-column:last-child {
      border-right: none;
    }

    .day-header {
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #E5E7EB;
      background: #F9FAFB;
    }

    .day-header.today {
      background: #FEF3C7;
      color: #92400E;
    }

    .day-name {
      font-size: 12px;
      font-weight: 500;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .day-header.today .day-name {
      color: #92400E;
    }

    .day-number {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .day-header.today .day-number {
      color: #92400E;
    }

    .day-content {
      position: relative;
      height: 1440px; /* 24 hours * 60px */
      overflow: visible;
     margin-top: 0;
    }

    .hour-slot {
      height: 60px;
      border-bottom: 1px solid #F3F4F6;
      position: relative;
    }

    .hour-slot.current-hour {
      background: rgba(245, 158, 11, 0.1);
    }

    .calendar-event {
      position: absolute;
      left: 4px;
      right: 4px;
      border-radius: 6px;
      padding: 8px;
      font-size: 12px;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 1;
      opacity: 0.9;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .calendar-event:hover {
      opacity: 1;
      transform: scale(1.02);
      z-index: 3;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .event-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .event-title {
      font-weight: 600;
      font-size: 11px;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .event-duration {
      font-size: 10px;
      opacity: 0.9;
      font-weight: 500;
    }

    @media (max-width: 1200px) {
      .calendario-container {
        margin-left: 0;
        padding: 16px;
      }

      .calendar-grid {
        overflow-x: auto;
        min-width: 800px;
      }

      .calendario-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .week-navigation {
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .day-column {
        min-width: 100px;
      }

      .event-title {
        font-size: 10px;
      }

      .event-duration {
        font-size: 9px;
      }
    }
  `]
})
export class CalendarioComponent {
  selectedWeek = new Date();
  
  timeSlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  weekDays = [
    { name: 'Lun', number: 26, isToday: false },
    { name: 'Mar', number: 27, isToday: false },
    { name: 'Mié', number: 28, isToday: false },
    { name: 'Jue', number: 29, isToday: false },
    { name: 'Vie', number: 30, isToday: false },
    { name: 'Sáb', number: 31, isToday: false },
    { name: 'Dom', number: 1, isToday: true }
  ];

  events: CalendarEvent[] = [
    {
      id: 1,
      title: 'Clase',
      subject: 'programacion',
      startTime: '08:00',
      endTime: '10:00',
      duration: '2.00h',
      color: '#F8A5A5',
      day: 2, // Miércoles
      startHour: 8,
      endHour: 10
    },
    {
      id: 2,
      title: 'Consulta cátedra',
      subject: 'calculo',
      startTime: '09:00',
      endTime: '10:00',
      duration: '1.00h',
      color: '#D4C5A9',
      day: 3, // Jueves
      startHour: 9,
      endHour: 10
    },
    {
      id: 3,
      title: 'Ejercicios',
      subject: 'fisica',
      startTime: '15:00',
      endTime: '16:48',
      duration: '1.80h',
      color: '#A5B4E8',
      day: 4, // Viernes
      startHour: 15,
      endHour: 16.8
    },
    {
      id: 4,
      title: '📋 Planificación',
      subject: 'general',
      startTime: '18:00',
      endTime: '19:00',
      duration: '1.00h',
      color: '#7FB069',
      day: 6, // Domingo
      startHour: 18,
      endHour: 19
    }
  ];

  previousWeek() {
    // Logic to navigate to previous week
    console.log('Previous week');
  }

  nextWeek() {
    // Logic to navigate to next week
    console.log('Next week');
  }

  getEventsForDay(dayIndex: number): CalendarEvent[] {
    return this.events.filter(event => event.day === dayIndex);
  }

  getEventTop(event: CalendarEvent): number {
    // Position relative to 00:00 (first time slot)
    return event.startHour * 60;
  }

  getEventHeight(event: CalendarEvent): number {
    const durationInHours = event.endHour - event.startHour;
    return durationInHours * 60; // 60px per hour
  }

  isCurrentHour(hourIndex: number): boolean {
    const currentHour = new Date().getHours();
    const slotHour = parseInt(this.timeSlots[hourIndex].split(':')[0]);
    return currentHour === slotHour;
  }
}