import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.scss'
})
export class Shop implements OnInit, OnDestroy {

  countdown: string = '';
  private intervalId: any;

  boxes = [
    { name: 'Caja 1' },
    { name: 'Caja 2' },
    { name: 'Caja 3' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  // ============================
  // TIMER LOGIC
  // ============================

  private getSpainTime(): Date {
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })
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

      this.countdown =
        `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    };

    updateCountdown();
    this.intervalId = setInterval(updateCountdown, 1000);
  }

  private refreshBoxes(): void {
    clearInterval(this.intervalId);

    this.generateNewBoxes();

    this.startCountdown();
  }

  private generateNewBoxes(): void {
    this.boxes = [
      { name: 'Caja A' },
      { name: 'Caja B' },
      { name: 'Caja C' }
    ];
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}