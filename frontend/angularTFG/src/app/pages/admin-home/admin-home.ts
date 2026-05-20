import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-home',
  imports: [],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.scss',
})
export class AdminHome {
  username: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();

    if (user) {
      this.username = user.name;
    }
  }

  logout() {
    this.authService.logout();
  }

  goToCreateCollection() {
    this.router.navigate(['/admin-collections']);
  }

  goToProbabilities() {
    this.router.navigate(['/admin-probabilities']);
  }

  goToCollectionCosts() {
    this.router.navigate(['/admin-costs']);
  }

  goToSpecialTrades() {
    this.router.navigate(['/admin-special-trades']);
  }
}
