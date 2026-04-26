import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementNotification } from '../../services/achievement-notification';

@Component({
  selector: 'app-achievement-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievement-popup.html',
  styleUrls: ['./achievement-popup.scss'],
})
export class AchievementPopupComponent implements OnInit {
  visible = false;

  achievements: number[] = [];

  constructor(private achievementService: AchievementNotification) {}

  ngOnInit(): void {
    this.achievementService.achievement$.subscribe((ids) => {
      if (!ids || ids.length === 0) return;
      console.log('popup recibió:', ids);
      this.achievements = ids;
      this.show();
    });
  }

  show() {
    this.visible = true;

    //para añadir sonido en un futuro ??
    const audio = new Audio('assets/sounds/achievement.mp3');
    audio.play();

    setTimeout(() => {
      this.visible = false;
      this.achievements = [];
    }, 3000);
  }
}
