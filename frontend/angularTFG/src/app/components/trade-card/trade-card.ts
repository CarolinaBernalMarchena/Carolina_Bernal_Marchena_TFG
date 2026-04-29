import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Api, Trade, User } from '../../services/api';
import { AuthService } from '../../services/auth';
import { TradeConfirmModal } from '../trade-confirm-modal/trade-confirm-modal';

@Component({
  selector: 'app-trade-card',
  standalone: true,
  imports: [TradeConfirmModal],
  templateUrl: './trade-card.html',
  styleUrl: './trade-card.scss',
})
export class TradeCard {
  @Input({ required: true }) trade!: Trade;
  @Output() tradeEnded = new EventEmitter<void>();

  currentUser: User | null = null;

  showModal = false;
  modalMessage = '';
  pendingAction: 'accept' | 'delete' | null = null;

  constructor(
    private api: Api,
    private authService: AuthService,
  ) {
    this.currentUser = this.authService.getUser();
  }

  private acceptTrade(trade: Trade): void {
    this.api.acceptTrade(trade.id).subscribe({
      next: (res) => {
        console.log('Trade aceptado', res);
        this.tradeEnded.emit();
      },
      error: (err) => {
        console.error('Error al aceptar trade', err);
      },
    });
  }

  private deleteTrade(trade: Trade): void {
    this.api.deleteTradeBackend(trade.id).subscribe({
      next: () => {
        this.tradeEnded.emit();
      },
      error: (err) => {
        console.error('Error al eliminar trade', err);
      },
    });
  }

  openAcceptModal(): void {
    this.modalMessage = '¿Quieres aceptar este intercambio?';
    this.pendingAction = 'accept';
    this.showModal = true;
  }

  openDeleteModal(): void {
    this.modalMessage =
      '¿Seguro que quieres eliminar este intercambio? Esta acción no se puede deshacer.';
    this.pendingAction = 'delete';
    this.showModal = true;
  }

  onModalConfirm(): void {
    this.showModal = false;

    if (this.pendingAction === 'accept') {
      this.acceptTrade(this.trade);
    }

    if (this.pendingAction === 'delete') {
      this.deleteTrade(this.trade);
    }

    this.pendingAction = null;
  }

  onModalCancel(): void {
    this.showModal = false;
    this.pendingAction = null;
  }
}
