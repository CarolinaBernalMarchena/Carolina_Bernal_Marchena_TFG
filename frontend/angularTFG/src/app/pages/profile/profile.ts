import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  constructor(private router: Router, private api: Api, private authService: AuthService) {}
  username: string = 'username';
  boxesCount: number = 0;
  specialCount: number = 0;
  tradesCount: number = 0;

  ngOnInit() {
    const user = this.authService.getUser();
    this.username = user?.name || 'username';
    this.boxesCount = this.countBoxes(user?.boxesOpened || []);
    this.specialCount = this.countSpecials(user?.boxesOpened || []);
    this.tradesCount = this.countTrades(user?.trades || []);
  }

  countBoxes(boxes: any[]): number {
    return boxes.length;
  }

  countSpecials(boxes: any[]): number {
    return boxes.filter(box => box.hasSpecial).length;
  }

  countTrades(trades: any[]): number {
    return trades.length;
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

  goToShop() {
    this.router.navigate(['/shop']);
  }

}