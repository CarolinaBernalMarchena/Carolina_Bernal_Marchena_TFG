import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';
import { ALL_ACHIEVEMENTS } from '../../constants/archievements_object';

interface AchievementView {
  id: number;
  name?: string;
  unlocked: boolean;
  image?: string;
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
  profilePicture: string = 'profile1';

  totalUnlocked: number = 0;
  achievements: AchievementView[] = [];

  constructor(
    private api: Api,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (user) {
      this.username = user.nombre || '';
      this.profilePicture = user.profilePicture || 'profile1';
    }

    this.loadAchievements();
  }

  loadAchievements(): void {
    this.api.getAchievements().subscribe({
      next: (res: any) => {
        const unlockedIds: number[] = res.unlockedIds || [];

        this.achievements = ALL_ACHIEVEMENTS.map((a) => ({
          id: a.id,
          name: a.name,
          image: a.image,
          unlocked: unlockedIds.includes(a.id),
        }));

        this.totalUnlocked = this.achievements.filter((a) => a.unlocked).length;
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
