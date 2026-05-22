import { Component, OnInit } from '@angular/core';
import { Api, Trade } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialTradeCard } from '../../components/special-trade-card/special-trade-card';

@Component({
  selector: 'app-admin-special-trades',
  standalone: true,
  imports: [CommonModule, SpecialTradeCard, FormsModule],
  templateUrl: './admin-special-trades.html',
  styleUrl: './admin-special-trades.scss',
})
export class AdminSpecialTrades implements OnInit {
  trades: Trade[] = [];
  filteredTrades: Trade[] = [];

  collections: { name: string; count: number }[] = [];

  selectedCollection: string = 'all';

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTrades();
  }

  loadTrades(): void {
    this.api.getSpecialTrades().subscribe({
      next: (data: any) => {
        this.trades = data;

        // Extraer colecciones igual que en trades normales
        this.extractCollections();

        // Aplicar filtros iniciales
        this.applyFilters();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  extractCollections() {
    const map = new Map<string, number>();

    this.trades.forEach((trade) => {
      const offered = trade.offeredBox?.collection;

      if (offered) {
        map.set(offered, (map.get(offered) || 0) + 1);
      }
    });

    this.collections = Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }

  applyFilters(): void {
    this.filteredTrades = this.trades.filter((trade) => {
      const matchCollection =
        this.selectedCollection === 'all' ||
        trade.offeredBox?.collection === this.selectedCollection ||
        trade.requestedBox?.collection === this.selectedCollection;

      return matchCollection;
    });
  }

  deleteTrade(id: number): void {
    this.api.deleteSpecialTrade(id).subscribe({
      next: () => {
        this.loadTrades();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  createTrade(): void {
    this.router.navigate(['/admin-create-special-trade']);
  }

  goBack(): void {
    this.router.navigate(['/admin-home']);
  }
}
