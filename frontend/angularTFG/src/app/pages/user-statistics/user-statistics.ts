import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Api, TokenHistory, Trade } from '../../services/api';
import { AuthService } from '../../services/auth';

export interface ActivityItem {
  type: 'gain' | 'spent' | 'trade' | 'achievement';
  title: string;
  amount?: number;
  date: string;
}

@Component({
  selector: 'app-user-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-statistics.html',
  styleUrl: './user-statistics.scss',
})
export class UserStatistics implements OnInit {
  activities: ActivityItem[] = [];
  groupedActivities: { date: string; items: ActivityItem[] }[] = [];
  loading = true;

  filters = {
    gain: true,
    spent: true,
    trade: true,
    achievement: true,
  };

  searchText = '';

  constructor(
    private api: Api,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  getIcon(type: ActivityItem['type']): string {
    switch (type) {
      case 'gain':
        return '💰';
      case 'spent':
        return '💸';
      case 'trade':
        return '🔁';
      case 'achievement':
        return '🏆';
      default:
        return '📌';
    }
  }

  getTypeLabel(type: ActivityItem['type']): string {
    switch (type) {
      case 'gain':
        return 'Ganado';
      case 'spent':
        return 'Gastado';
      case 'trade':
        return 'Intercambio';
      case 'achievement':
        return 'Logro';
      default:
        return type;
    }
  }

  getAmountSign(item: ActivityItem): string {
    return item.type === 'gain' ? '+' : '-';
  }

  get filteredActivities(): ActivityItem[] {
    return this.activities.filter((item) => {
      const matchesType = this.filters[item.type];

      const matchesText =
        this.searchText.trim() === '' ||
        item.title.toLowerCase().includes(this.searchText.toLowerCase());

      return matchesType && matchesText;
    });
  }

  private loadStatistics(): void {
    forkJoin({
      tokens: this.api.getTokenHistory(),
      trades: this.api.getTrades(),
      achievements: this.api.getAchievements(),
    }).subscribe({
      next: ({ tokens, trades, achievements }) => {
        const events: ActivityItem[] = [];

        tokens.forEach((t: TokenHistory) => {
          let title = t.reason;

          if (t.type === 'spent' && t.reason.includes('Compra de caja')) {
            title = `Compra de caja → ${t.reason.replace('Compra de caja de ', '')}`;
          }

          if (t.type === 'gain' && t.reason.includes('Logro desbloqueado')) {
            title = 'Recompensa de logro';
          }

          events.push({
            type: t.type,
            title,
            amount: t.amount,
            date: t.date,
          });
        });

        trades
          .filter((t: Trade) => t.status)
          .forEach((t: Trade) => {
            events.push({
              type: 'trade',
              title: `Intercambio: ${t.offeredBoxName} ↔ ${t.requestedBoxName}`,
              date: t.date,
            });
          });

        const nameMap: Record<number, string> = {
          1: 'Primer paso',
          2: 'Viciado',
          3: 'Coleccionista',
          4: 'Suertudo',
          5: 'Destino',
          6: 'Dios del RNG',
          7: 'Permutante',
          8: 'Negociador de oro',
          9: 'Comerciante experto',
        };

        achievements.unlockedIds.forEach((id: number) => {
          events.push({
            type: 'achievement',
            title: `Logro desbloqueado: ${nameMap[id] || `Logro #${id}`}`,
            date: new Date().toISOString(),
          });
        });

        this.activities = events.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        this.groupByDate(this.filteredActivities);
        this.loading = false;
      },

      error: (err) => {
        console.error('Error cargando estadísticas', err);
        this.loading = false;
      },
    });
  }

  private groupByDate(items: ActivityItem[]) {
    const groups: Record<string, ActivityItem[]> = {};

    items.forEach((item) => {
      const dateKey = new Date(item.date).toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(item);
    });

    this.groupedActivities = Object.keys(groups).map((date) => ({
      date,
      items: groups[date],
    }));
  }

  updateFilters() {
    this.groupByDate(this.filteredActivities);
  }

  toggleFilter(type: keyof typeof this.filters) {
    this.filters[type] = !this.filters[type];
    this.updateFilters();
  }

  onSearchChange(value: string) {
    this.searchText = value;
    this.updateFilters();
  }

  goBack() {
    window.history.back();
  }
}
