import { Component, OnInit } from '@angular/core';
import { Api, Trade } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialTradeCard } from '../../components/special-trade-card/special-trade-card';
import { TradeConfirmModal } from '../../components/trade-confirm-modal/trade-confirm-modal';

@Component({
  selector: 'app-admin-special-trades',
  standalone: true,
  imports: [CommonModule, SpecialTradeCard, FormsModule, TradeConfirmModal],
  templateUrl: './admin-special-trades.html',
  styleUrl: './admin-special-trades.scss',
})
export class AdminSpecialTrades implements OnInit {
  trades: Trade[] = [];
  filteredTrades: Trade[] = [];
  collections: { name: string; count: number }[] = [];
  selectedCollection: string = 'all';
  showModal = false;
  modalMessage = '';
  pendingDeleteId: number | null = null;

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
        this.extractCollections();
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

  openDeleteModal(id: number): void {
    this.pendingDeleteId = id;
    this.modalMessage =
      '¿Seguro que quieres eliminar este intercambio? Esta acción no se puede deshacer.';
    this.showModal = true;
  }

  onModalConfirm(): void {
    if (this.pendingDeleteId !== null) {
      this.deleteTrade(this.pendingDeleteId);
    }
    this.showModal = false;
    this.pendingDeleteId = null;
  }

  onModalCancel(): void {
    this.showModal = false;
    this.pendingDeleteId = null;
  }

  deleteTrade(id: number): void {
    this.api.deleteTradeBackend(id).subscribe({
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
