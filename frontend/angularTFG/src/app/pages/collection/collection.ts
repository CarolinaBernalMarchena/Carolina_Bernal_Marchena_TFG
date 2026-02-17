import { Component, OnInit } from '@angular/core';
import { Api, BoxOpened } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection.html',
  styleUrl: './collection.scss',
})
export class Collection implements OnInit {

  collectibles: BoxOpened[] = [];

  constructor(private api: Api, private router: Router) {}

  ngOnInit(): void {
    const user = this.api.getCurrentUser();
    this.collectibles = user.boxesOpened;
  }

  onCollectibleClick(item: BoxOpened): void {
    this.router.navigate(['/collection', item.id]);
    console.log(item);
  }

  goBackHome(): void {
    this.router.navigate(['/profile']);
  }

}