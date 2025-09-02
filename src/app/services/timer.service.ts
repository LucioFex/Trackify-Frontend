import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timerSubject = new BehaviorSubject<number>(0);
  private isRunningSubject = new BehaviorSubject<boolean>(false);
  private timerSubscription?: Subscription;
  private startTime?: Date;

  timer$ = this.timerSubject.asObservable();
  isRunning$ = this.isRunningSubject.asObservable();

  start() {
    if (this.isRunningSubject.value) return;
    
    this.startTime = new Date();
    this.isRunningSubject.next(true);
    
    this.timerSubscription = interval(1000).subscribe(() => {
      const current = this.timerSubject.value + 1;
      this.timerSubject.next(current);
    });
  }

  stop() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    
    this.isRunningSubject.next(false);
    return {
      startTime: this.startTime,
      endTime: new Date(),
      duration: this.timerSubject.value
    };
  }

  reset() {
    this.timerSubject.next(0);
    this.isRunningSubject.next(false);
    this.startTime = undefined;
    
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}