import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  username: string = 'username';
  profilePicture: string = 'profile1';

  boxesCount: number = 0;
  specialCount: number = 0;
  tradesCount: number = 0;
  datosCargados: boolean = false;

  constructor(
    private router: Router,
    private api: Api,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();

    if (user) {
      this.username = user.name || 'username';
      this.profilePicture = user.profilePicture || 'profile1';
    }

    this.api.getProfileStats().subscribe({
      next: (data: any) => {
        this.datosCargados = true;
        this.boxesCount = data.boxesCount;
        this.specialCount = data.specialCount;
        this.tradesCount = data.tradesCount;
      },
      error: (err) => {
        console.error('Error fetching profile stats:', err);
        this.boxesCount = 0;
        this.specialCount = 0;
        this.tradesCount = 0;
      },
    });
  }

  goBackHome() {
    this.router.navigate(['/home']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToCollection() {
    this.router.navigate(['/collection']);
  }

  goToAchievements() {
    this.router.navigate(['/achievements']);
  }

  goToStatistics() {
    this.router.navigate(['/statistics']);
  }
}
