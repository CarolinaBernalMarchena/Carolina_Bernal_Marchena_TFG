import { Component, OnInit } from '@angular/core';
import { Api, Trade } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TradeCard } from '../../components/trade-card/trade-card';
import { SpecialTradeCard } from '../../components/special-trade-card/special-trade-card';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [CommonModule, TradeCard, SpecialTradeCard],
  templateUrl: './trades.html',
  styleUrls: ['./trades.scss'],
})
export class Trades implements OnInit {
  trades: Trade[] = [];

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTrades();
  }

  loadTrades() {
    this.api.getTrades().subscribe((res: any) => {
      this.trades = res;
    });
  }

  deleteTrade(tradeId: number) {
    this.api.deleteTradeBackend(tradeId).subscribe(() => {
      this.loadTrades();
    });
  }

  goBackHome(): void {
    this.router.navigate(['/home']);
  }

  createTrade(): void {
    this.router.navigate(['/create-trade']);
  }
  tradeEnded(): void {
    this.loadTrades();
  }
}
