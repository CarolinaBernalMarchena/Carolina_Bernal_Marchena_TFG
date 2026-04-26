import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { AchievementNotification } from '../../services/achievement-notification';

interface AchievementView {
  id: number;
  name?: string;
  unlocked: boolean;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss',
})
export class Achievements implements OnInit {
  username: string = '';
  totalUnlocked: number = 0;
  achievements: AchievementView[] = [];

  constructor(
    private api: Api,
    private router: Router,
    private achievementNotification: AchievementNotification,
  ) {}

  ngOnInit(): void {
    this.loadAchievements();
  }

  loadAchievements(): void {
    this.api.getAchievements().subscribe({
      next: (res: any) => {
        const unlockedIds: number[] = res.unlockedIds || [];
        const newAchievements: number[] = res.newAchievements || [];

        // Catálogo local de logros
        const ALL_ACHIEVEMENTS = [
          { id: 1, name: 'Primer paso' },
          { id: 2, name: 'Viciado' },
          { id: 3, name: 'Coleccionista' },
          { id: 4, name: 'Suertudo' },
          { id: 5, name: 'Dios del RNG' },
        ];

        // Mapear estado
        this.achievements = ALL_ACHIEVEMENTS.map((a) => ({
          id: a.id,
          name: a.name,
          unlocked: unlockedIds.includes(a.id),
        }));

        // Contador
        this.totalUnlocked = this.achievements.filter((a) => a.unlocked).length;

        if (newAchievements.length > 0) {
          this.achievementNotification.showAchievements(newAchievements);
        }
      },
      error: (err) => {
        console.error('Error cargando logros', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}
