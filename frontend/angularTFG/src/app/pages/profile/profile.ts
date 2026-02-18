import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  username: string = '';
  boxesCount: number = 0;
  specialCount: number = 0;
  tradesCount: number = 0;

  constructor(private router: Router, private api: Api) {}

  ngOnInit() {
    const user = this.api.getCurrentUser();
    
    this.username = user.nombre;
    this.boxesCount = this.countBoxes(user.boxesOpened);
    this.specialCount = this.countSpecials(user.boxesOpened);
    this.tradesCount = this.countTrades(user.trades);
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

}