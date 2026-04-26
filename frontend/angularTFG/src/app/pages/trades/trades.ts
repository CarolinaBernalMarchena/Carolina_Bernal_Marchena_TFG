import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { Trade } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TradeCard } from '../../components/trade-card/trade-card';
import { SpecialTradeCard } from '../../components/special-trade-card/special-trade-card';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [CommonModule, TradeCard, FormsModule],
  templateUrl: './trades.html',
  styleUrls: ['./trades.scss'],
})
export class Trades implements OnInit {
  allTrades: Trade[] = [];
  filteredTrades: Trade[] = [];

  collections: { name: string; count: number }[] = [];

  selectedCollection: string = 'all';

  //SOLO cajas especiales (hasSpecial)
  onlySpecialBoxes: boolean = false;
  //Intercambios especiales (los creados por la plataforma, no tienen por qué ser cajas especiales)
  onlyPlatformTrades: boolean = false;

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTrades();
  }

  loadTrades() {
    this.api.getTrades().subscribe((trades: any) => {
      this.allTrades = trades;

      this.api.getAllBoxes().subscribe((boxes: any) => {
        this.extractCollections(boxes);
        this.applyFilters();
      });
    });
  }

  extractCollections(boxes: any[]) {
    const map = new Map<string, number>();

    // Inicializamos las colecciones
    boxes.forEach((box) => {
      if (!map.has(box.collection)) {
        map.set(box.collection, 0);
      }
    });

    // Contamos SOLO ofertas de trades
    this.allTrades.forEach((trade) => {
      const offered = trade.offeredBox?.collection;

      if (offered && map.has(offered)) {
        map.set(offered, map.get(offered)! + 1);
      }
    });

    this.collections = Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }

  applyFilters() {
    this.filteredTrades = this.allTrades.filter((trade) => {
      const matchCollection =
        this.selectedCollection === 'all' ||
        trade.offeredBox?.collection === this.selectedCollection ||
        trade.requestedBox?.collection === this.selectedCollection;

      //SOLO cajas especiales (no intercambios de plataforma)
      const matchSpecialBoxes =
        !this.onlySpecialBoxes ||
        trade.offeredBox?.hasSpecial === true ||
        trade.requestedBox?.hasSpecial === true;

      // Intercambios especiales (los creados por la plataforma, no tienen por qué ser cajas especiales)
      const matchPlatformTrades =
        !this.onlyPlatformTrades || trade.ownerId == 0;

      return matchCollection && matchSpecialBoxes && matchPlatformTrades;
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
