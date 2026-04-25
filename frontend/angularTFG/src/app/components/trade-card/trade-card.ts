import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Api, Trade, User } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-trade-card',
  imports: [],
  templateUrl: './trade-card.html',
  styleUrl: './trade-card.scss',
})
export class TradeCard {
  @Input({ required: true }) trade!: Trade;
  @Output() tradeEnded = new EventEmitter<void>();

  currentUser: User | null = null;
  constructor(
    private api: Api,
    private authService: AuthService,
  ) {
    this.currentUser = this.authService.getUser();
  }

  acceptTrade(trade: Trade) {
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

  deleteTrade(trade: Trade): void {
    this.api.deleteTradeBackend(trade.id).subscribe(() => {
      this.endTrade();
    });
  }

  endTrade() {
    this.tradeEnded.emit();
  }
}
