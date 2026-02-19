import { Component, OnInit } from '@angular/core';
import { Api, Trade } from '../../services/api';

@Component({
  selector: 'app-trades',
  imports: [],
  templateUrl: './trades.html',
  styleUrl: './trades.scss',
})
export class Trades implements OnInit {

  trades: Trade[] = [];

  constructor(private api: Api) {}
  ngOnInit(): void {
    this.loadTrades();
  }
  loadTrades() {
    this.api.getOpenTrades().subscribe(res => {
      this.trades = res;
    });
  }

  acceptTrade(trade: Trade) {
    this.api.acceptTrade(trade.id).subscribe(() => {
      this.loadTrades();
    });
  }

  getUserName(id: number): string {
    const user = this.api.getUserById(id);
    return user ? user.nombre : 'Usuario';
  }
}
