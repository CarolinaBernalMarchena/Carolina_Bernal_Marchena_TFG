import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  constructor(private router: Router, private authService: AuthService) {}
  username: string = 'username';

    ngOnInit() {
    const user = this.authService.getUser();
    this.username = user?.name || 'username';
  }

    logout() {
    this.authService.logout();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToCollection() {
    this.router.navigate(['/collection']);
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  goToTrades() {
    this.router.navigate(['/trades']);
  }
}