import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { Api, TokenHistory, Trade } from '../../services/api';
import { AuthService } from '../../services/auth';

import {
  NgApexchartsModule,
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexGrid,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexTheme,
} from 'ng-apexcharts';
import { ALL_ACHIEVEMENTS } from '../../constants/archievements_object';

export interface ActivityItem {
  type: 'gain' | 'spent' | 'trade' | 'achievement';
  title: string;
  amount?: number;
  date: string;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  theme: ApexTheme;
  colors: string[];
};

@Component({
  selector: 'app-user-statistics',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './user-statistics.html',
  styleUrl: './user-statistics.scss',
})
export class UserStatistics implements OnInit {
  activities: ActivityItem[] = [];

  groupedActivities: { date: string; items: ActivityItem[] }[] = [];

  loading = true;

  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions!: Partial<ChartOptions>;

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
            title = `Compra de caja → ${t.reason.replace(
              'Compra de caja de ',
              '',
            )}`;
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

        achievements.achievements.forEach((a) => {
          const meta = ALL_ACHIEVEMENTS.find((x) => x.id === a.achievementId);

          events.push({
            type: 'achievement',
            title: `Logro desbloqueado: ${meta?.name || `Logro #${a.achievementId}`}`,
            date: a.unlockedAt,
          });
        });

        this.activities = events.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        this.buildHeatmap();

        this.groupByDate(this.filteredActivities);

        this.loading = false;
      },

      error: (err) => {
        console.error('Error cargando estadísticas', err);
        this.loading = false;
      },
    });
  }

  private buildHeatmap(): void {
    const last7Days: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();

      d.setDate(d.getDate() - i);

      last7Days.push(
        d.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
        }),
      );
    }

    const activityTypes = [
      {
        key: 'gain',
        label: '💰 Ganado',
      },

      {
        key: 'spent',
        label: '💸 Gastado',
      },

      {
        key: 'trade',
        label: '🔁 Intercambios',
      },

      {
        key: 'achievement',
        label: '🏆 Logros',
      },
    ];

    const series = activityTypes.map((type) => {
      return {
        name: type.label,

        data: last7Days.map((day) => {
          const matchingActivities = this.activities.filter((a) => {
            const activityDay = new Date(a.date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
            });

            return activityDay === day && a.type === type.key;
          });

          let value = 0;

          if (type.key === 'gain' || type.key === 'spent') {
            value = matchingActivities.reduce(
              (sum, a) => sum + (a.amount || 0),
              0,
            );
          } else {
            value = matchingActivities.length;
          }

          return {
            x: day,
            y: value,
          };
        }),
      };
    });

    this.chartOptions = {
      series,

      chart: {
        type: 'heatmap',
        height: 350,

        toolbar: {
          show: false,
        },

        background: 'transparent',
      },

      dataLabels: {
        enabled: true,
      },

      colors: ['#86efac', '#fca5a5', '#c4b5fd', '#fcd34d'],

      title: {
        text: 'Actividad de los últimos 7 días',

        style: {
          fontSize: '18px',
          fontWeight: '700',
          color: '#ffffff',
        },
      },

      xaxis: {
        type: 'category',

        labels: {
          style: {
            colors: '#a1a1aa',
          },
        },
      },

      plotOptions: {
        heatmap: {
          distributed: true,

          radius: 10,

          shadeIntensity: 0.65,

          useFillColorAsStroke: false,

          colorScale: {
            ranges: [
              {
                from: 0,
                to: 0,
                color: '#27272a',
                name: 'Sin actividad',
              },

              {
                from: 1,
                to: 100,
                color: '#3b82f6',
                name: 'Baja',
              },

              {
                from: 101,
                to: 500,
                color: '#6366f1',
                name: 'Media',
              },

              {
                from: 501,
                to: 999999,
                color: '#8b5cf6',
                name: 'Alta',
              },
            ],
          },
        },
      },

      stroke: {
        width: 2,
        colors: ['#18181b'],
      },

      tooltip: {
        theme: 'dark',

        y: {
          formatter: (value, opts) => {
            const seriesName = opts.w.config.series[opts.seriesIndex].name;

            if (
              seriesName.includes('Ganado') ||
              seriesName.includes('Gastado')
            ) {
              return `${value} monedas`;
            }

            if (seriesName.includes('Intercambios')) {
              return `${value} intercambios`;
            }

            return `${value} logros`;
          },
        },
      },

      theme: {
        mode: 'dark',
      },

      grid: {
        padding: {
          top: 10,
          right: 10,
          left: 10,
          bottom: 0,
        },
      },
    };
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
