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

  boxes: BoxOpened[] = [];
  uniqueBoxes: BoxOpened[] = [];

  constructor(private api: Api, private router: Router) {}

  ngOnInit(): void {
    const user = this.api.getCurrentUser();
    this.boxes = user.boxesOpened;
    this.buildUniqueCollection(this.boxes);
  }

  private buildUniqueCollection(boxes: BoxOpened[]): void {
    const map: { [type: string]: BoxOpened } = {};

    boxes.forEach(box => {
      if (!map[box.type]) {
        map[box.type] = box;
      }
    });

    this.uniqueBoxes = Object.values(map);
  }

  onCollectibleClick(box: any) {
    this.router.navigate(['/collection-detail', box.type]);
  }

  goBackHome(): void {
    this.router.navigate(['/profile']);
  }

}