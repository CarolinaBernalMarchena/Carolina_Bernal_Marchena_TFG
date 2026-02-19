import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  constructor(private router: Router, private api: Api) {}
  username: string = 'username';

    ngOnInit() {
    const user = this.api.getCurrentUser();
    
    this.username = user.nombre;
  }

    logout() {
    this.router.navigate(['/login']);
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