import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementNotification } from '../../services/achievement-notification';

@Component({
  selector: 'app-achievement-popup',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="popup" *ngIf="visible">🎉 Logro desbloqueado!</div> `,
  styleUrls: ['./achievement-popup.scss'],
})
export class AchievementPopupComponent implements OnInit {
  visible = false;

  constructor(private achievementService: AchievementNotification) {}

  ngOnInit(): void {
    this.achievementService.achievement$.subscribe((ids) => {
      this.show();
    });
  }

  show() {
    this.visible = true;

    // 🔊 sonido
    const audio = new Audio('assets/sounds/achievement.mp3');
    audio.play();

    setTimeout(() => {
      this.visible = false;
    }, 3000);
  }
}
