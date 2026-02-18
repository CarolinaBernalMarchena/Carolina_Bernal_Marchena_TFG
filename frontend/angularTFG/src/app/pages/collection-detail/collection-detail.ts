import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Api, BoxOpened } from '../../services/api';

interface CollectionItem extends BoxOpened {
  total: number;
}

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-detail.html',
  styleUrl: './collection-detail.scss',
})
export class CollectionDetail implements OnInit {

  collection: CollectionItem[] = [];

  constructor(
    private router: Router,
    private api: Api
  ) {}

  ngOnInit(): void {
    const user = this.api.getCurrentUser();
    this.buildCollection(user.boxesOpened);
  }

  private buildCollection(boxes: BoxOpened[]): void {
    const map: { [type: string]: CollectionItem } = {};

    boxes.forEach(box => {
      if (!map[box.type]) {
        map[box.type] = {
          ...box,
          total: 0
        };
      }

      map[box.type].total++;
    });

    this.collection = Object.values(map).map(box => ({
      ...box,
      repetido: box.total - 1
    }));
  }

  goBack(): void {
    this.router.navigate(['/collection']);
  }
}