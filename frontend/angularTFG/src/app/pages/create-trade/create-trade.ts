import { Component, OnInit } from '@angular/core';
import { Api, BoxOpened, User } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-trade',
  imports: [],
  templateUrl: './create-trade.html',
  styleUrl: './create-trade.scss',
})
export class CreateTrade implements OnInit {
  currentUser!: User;
  selectedMyBoxId?: number;
  requestedBoxId?: number;

  duplicatedBoxes: BoxOpened[] = [];

  constructor(private api: Api, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.api.getCurrentUser();
    this.duplicatedBoxes = this.currentUser.boxesOpened.filter(b => b.repetido > 0);
  }

  proposeTrade() {
    if (!this.selectedMyBoxId || !this.requestedBoxId) return;

    this.api.createTrade({
      offeredBoxId: this.selectedMyBoxId,
      requestedBoxId: this.requestedBoxId
    }).subscribe(() => {
      alert('Intercambio propuesto correctamente');
    });
  }

  goBack() {
    this.router.navigate(['/trades']);
  }
}