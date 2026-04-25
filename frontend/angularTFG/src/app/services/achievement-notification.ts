import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class AchievementNotification {
  private achievementSubject = new Subject<number[]>();

  achievement$ = this.achievementSubject.asObservable();

  showAchievements(ids: number[]) {
    this.achievementSubject.next(ids);
  }
}
