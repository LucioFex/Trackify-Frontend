import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionsSubject = new BehaviorSubject<StudySession[]>([
    {
      id: 1,
      description: 'Repaso listas enlazadas',
      subject: 'programacion',
      activity: 'teoria',
      startTime: '09:10',
      endTime: '10:12',
      duration: '01:02:00',
      subjectColor: 'brown'
    },
    {
      id: 2,
      description: 'Integrales por partes',
      subject: 'calculo',
      activity: 'practica',
      startTime: '10:30',
      endTime: '11:08',
      duration: '00:38:00',
      subjectColor: 'green'
    },
    {
      id: 3,
      description: 'Ejercicios de cinemática',
      subject: 'fisica',
      activity: 'practica',
      startTime: '14:15',
      endTime: '15:45',
      duration: '01:30:00',
      subjectColor: 'blue'
    },
    {
      id: 4,
      description: 'Lectura capítulo 5 - Algoritmos de ordenamiento',
      subject: 'programacion',
      activity: 'teoria',
      startTime: '16:00',
      endTime: '17:25',
      duration: '01:25:00',
      subjectColor: 'brown'
    },
    {
      id: 5,
      description: 'Repaso derivadas parciales',
      subject: 'calculo',
      activity: 'repaso',
      startTime: '19:30',
      endTime: '20:15',
      duration: '00:45:00',
      subjectColor: 'green'
    },
    {
      id: 6,
      description: 'Laboratorio - Movimiento rectilíneo',
      subject: 'fisica',
      activity: 'practica',
      startTime: '08:00',
      endTime: '09:30',
      duration: '01:30:00',
      subjectColor: 'blue'
    }
  ]);

  sessions$ = this.sessionsSubject.asObservable();

  addSession(session: Omit<StudySession, 'id'>) {
    const currentSessions = this.sessionsSubject.value;
    const newSession = {
      ...session,
      id: Math.max(...currentSessions.map(s => s.id), 0) + 1
    };
    
    this.sessionsSubject.next([newSession, ...currentSessions]);
  }

  getSessions() {
    return this.sessionsSubject.value;
  }
}