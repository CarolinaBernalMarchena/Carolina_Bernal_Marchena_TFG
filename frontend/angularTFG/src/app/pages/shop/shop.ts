import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { Location } from '@angular/common';
import { AchievementNotification } from '../../services/achievement-notification';
import { ChatbotAvatar } from '../../components/chatbot-avatar/chatbot-avatar';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ChatbotAvatar, Modal],
  providers: [],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop implements OnInit, OnDestroy {
  countdown: string = '';
  private intervalId: any;

  showModal = false;
  modalMessage = '';

  boxes: any[] = [];

  constructor(
    private router: Router,
    private api: Api,
    private location: Location,
    private achievementNotification: AchievementNotification,
  ) {}

  ngOnInit(): void {
    const savedBoxes = localStorage.getItem('shopBoxes');
    const savedTimestamp = localStorage.getItem('shopBoxesTimestamp');
    const now = this.getSpainTime();

    if (savedBoxes && savedTimestamp) {
      const nextReset = this.getNextResetTime();

      if (now < nextReset) {
        this.boxes = JSON.parse(savedBoxes);
      } else {
        this.loadShopBoxes();
      }
    } else {
      this.loadShopBoxes();
    }

    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  goBack(): void {
    this.location.back();
  }

  openBox(box: any): void {
    this.api.openRandomBox(box.collection).subscribe({
      next: (res: any) => {
        this.modalMessage = `Has abierto la caja de ${res.box.type}`;
        this.showModal = true;

        this.api.getAchievements().subscribe((achRes: any) => {
          if (achRes.newAchievements.length) {
            for (const id of achRes.newAchievements) {
              this.achievementNotification.showAchievements(id);
            }
          }
        });
      },
    });
  }

  private getSpainTime(): Date {
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }),
    );
  }

  private getNextResetTime(): Date {
    const now = this.getSpainTime();
    const nextReset = new Date(now);

    const hours = now.getHours();

    if (hours < 12) {
      nextReset.setHours(12, 0, 0, 0);
    } else {
      nextReset.setDate(nextReset.getDate() + 1);
      nextReset.setHours(0, 0, 0, 0);
    }

    return nextReset;
  }

  private startCountdown(): void {
    const updateCountdown = () => {
      const now = this.getSpainTime();
      const nextReset = this.getNextResetTime();
      const diff = nextReset.getTime() - now.getTime();

      if (diff <= 0) {
        this.refreshBoxes();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      this.countdown = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    };

    updateCountdown();
    this.intervalId = setInterval(updateCountdown, 1000);
  }

  private refreshBoxes(): void {
    clearInterval(this.intervalId);
    this.loadShopBoxes();
    this.startCountdown();
  }

  loadShopBoxes(): void {
    this.api.getShopBoxes().subscribe({
      next: (data: any) => {
        this.boxes = data;
        localStorage.setItem('shopBoxes', JSON.stringify(data));
        localStorage.setItem('shopBoxesTimestamp', Date.now().toString());
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
