import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Api, Trade, User } from '../../services/api';
import { AuthService } from '../../services/auth';
import { TradeConfirmModal } from '../trade-confirm-modal/trade-confirm-modal';
import { AchievementNotification } from '../../services/achievement-notification';

@Component({
  selector: 'app-special-trade-card',
  imports: [TradeConfirmModal],
  templateUrl: './special-trade-card.html',
  styleUrl: './special-trade-card.scss',
})
export class SpecialTradeCard {
  @Input({ required: true }) trade!: Trade;
  @Input() showAcceptButton: boolean = true;
  @Output() tradeEnded = new EventEmitter<void>();

  currentUser: User | null = null;

  showModal = false;
  modalMessage = '';
  pendingAction: 'accept' | 'delete' | null = null;

  constructor(
    private api: Api,
    private authService: AuthService,
    private achievementNotification: AchievementNotification,
  ) {
    this.currentUser = this.authService.getUser();
  }

  private acceptTrade(trade: Trade): void {
    this.api.acceptTrade(trade.id).subscribe({
      next: (res) => {
        console.log('Trade aceptado', res);

        this.api.getAchievements().subscribe((achRes: any) => {
          if (achRes.newAchievements.length) {
            for (const id of achRes.newAchievements) {
              this.achievementNotification.showAchievements(id);
            }
          }
        });

        this.tradeEnded.emit();
      },
      error: (err) => {
        console.error('Error al aceptar trade', err);
      },
    });
  }

  openAcceptModal(): void {
    this.modalMessage = '¿Quieres aceptar este intercambio?';
    this.pendingAction = 'accept';
    this.showModal = true;
  }

  onModalConfirm(): void {
    this.showModal = false;

    if (this.pendingAction === 'accept') {
      this.acceptTrade(this.trade);
    }

    this.pendingAction = null;
  }

  onModalCancel(): void {
    this.showModal = false;
    this.pendingAction = null;
  }
}
