export interface StudySession {
  id: number;
  description: string;
  subject: string;
  activity: string;
  startTime: Date;
  endTime: Date;
  duration: number; // en segundos
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Activity {
  id: string;
  name: string;
  type: 'theory' | 'practice' | 'review';
}