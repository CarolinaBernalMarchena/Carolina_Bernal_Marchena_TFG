import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  private intervalId: any;
  countdown: string = '';
  showModal = false;
  modalMessage = '';
  modalImage = '';
  tokens: number = 0;
  boxes: any[] = [];
  showHistory = false;
  tokenHistory: any[] = [];

  constructor(
    private api: Api,
    private location: Location,
    private achievementNotification: AchievementNotification,
  ) {}

  ngOnInit(): void {
    const now = this.getSpainTime();
    this.loadShopBoxes();
    this.startCountdown();
    this.refreshTokensData();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  goBack(): void {
    this.location.back();
  }

  openBox(box: any): void {
    //Si el usuario no tiene tokens, mostramos un mensaje y no permitimos abrir la caja
    if (this.tokens <= 0) {
      this.modalMessage = 'Tienes 0 tokens, no puedes hacer ninguna compra';
      this.showModal = true;
      return;
    }

    this.api.openRandomBox(box.collection).subscribe({
      next: (res: any) => {
        console.log(res);
        this.modalImage = res.box.imageUrl;
        this.modalMessage = `Has abierto la caja de ${res.box.type}`;
        this.showModal = true;
        this.refreshTokensData();

        this.api.getAchievements().subscribe((achRes: any) => {
          if (achRes.newAchievements.length) {
            for (const id of achRes.newAchievements) {
              this.achievementNotification.showAchievements(id);
            }
          }
          this.loadTokenHistory();
        });
      },
    });
  }

  private getSpainTime(): Date {
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }),
    );
  }

  private startCountdown(): void {
    const updateCountdown = () => {
      const now = this.getSpainTime();

      //Próximas cajas a medianoche (hora española)
      const nextReset = new Date(now);

      nextReset.setHours(24, 0, 0, 0);

      const diff = nextReset.getTime() - now.getTime();

      //Al llegar a las 00:00
      if (diff <= 0) {
        this.refreshBoxes();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));

      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      const seconds = Math.floor((diff / 1000) % 60);

      this.countdown = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    };

    //Ejecutamos inmediatamente el update del contador
    updateCountdown();

    //Actualizamos cada segundo
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
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  loadTokens(): void {
    this.api.getTokens().subscribe({
      next: (res) => {
        this.tokens = res.tokens;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadTokenHistory(): void {
    this.api.getTokenHistory().subscribe({
      next: (res) => {
        this.tokenHistory = res;
      },
      error: (err) => {
        console.error('Error cargando historial de tokens', err);
        this.tokenHistory = [];
      },
    });
  }

  private refreshTokensData(): void {
    this.loadTokens();
    this.loadTokenHistory();
  }
}
