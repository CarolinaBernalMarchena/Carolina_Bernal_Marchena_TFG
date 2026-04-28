import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AchievementNotification {
  private achievementSubject = new BehaviorSubject<number | null>(null);

  achievement$ = this.achievementSubject.asObservable();

  showAchievements(id: number) {
    this.achievementSubject.next(id);
  }
}
