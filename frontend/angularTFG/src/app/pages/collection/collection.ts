import { Component, OnInit } from '@angular/core';
import { Api, BoxOpened } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

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
  boxesCount: number = 0;

  constructor(
    private api: Api,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCollection();
    this.api.getProfileStats().subscribe({
      next: (data: any) => {
        this.boxesCount = data.boxesCount;
      },
      error: (err) => {
        console.error('Error fetching profile stats:', err);
        this.boxesCount = 0;
      },
    });
  }

  private loadCollection(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.api.getMyCollection().subscribe({
      next: (data: any) => {
        this.boxes = data.map((item: any) => ({
          id: item.Box.id,
          collection: item.Box.collection,
          type: item.Box.type,
          hasSpecial: item.Box.hasSpecial,
          descripcion: item.Box.description,
          repeated: item.quantity - 1,
          imageUrl: item.Box.imageUrl,
        }));

        this.buildUniqueCollection(this.boxes);
      },
      error: (err) => {
        console.error('Error cargando colección', err);
      },
    });
  }

  onCollectibleClick(box: any) {
    this.router.navigate(['/collection-detail', box.type]);
  }

  goBackHome(): void {
    this.router.navigate(['/profile']);
  }

  private buildUniqueCollection(boxes: any[]): void {
    const map = new Map<string, any>();

    boxes.forEach((box) => {
      if (!map.has(box.type)) {
        map.set(box.type, box);
      }
    });

    this.uniqueBoxes = Array.from(map.values());
    console.log('Unique boxes:', this.uniqueBoxes);
  }
}
