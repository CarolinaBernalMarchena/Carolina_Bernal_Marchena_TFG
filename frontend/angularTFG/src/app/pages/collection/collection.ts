import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection.html',
  styleUrl: './collection.scss',
})
export class Collection implements OnInit {
  boxes: any[] = [];
  uniqueBoxes: any[] = [];
  filteredBoxes: any[] = [];

  collections: string[] = [];
  selectedCollection: string = 'all';

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

    forkJoin({
      all: this.api.getAllBoxes(),
      mine: this.api.getMyCollection(user.id),
    }).subscribe({
      next: ({ all, mine }: any) => {
        const ownedTypes = new Set(mine.map((item: any) => item.Box.type));

        this.boxes = all.map((box: any) => ({
          id: box.id,
          collection: box.collection,
          type: box.type,
          hasSpecial: box.hasSpecial,
          descripcion: box.description,
          imageUrl: box.imageUrl,
          unlocked: ownedTypes.has(box.type),
        }));

        this.buildUniqueCollection(this.boxes);
      },
      error: (err) => {
        console.error('Error cargando colección', err);
      },
    });
  }

  private buildUniqueCollection(boxes: any[]): void {
    const map = new Map<string, any>();

    boxes.forEach((box) => {
      if (!map.has(box.type)) {
        map.set(box.type, box);
      }
    });

    this.uniqueBoxes = Array.from(map.values());

    this.collections = [
      ...new Set(this.uniqueBoxes.map((box) => box.collection)),
    ];

    this.applyFilter();
  }

  onCollectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCollection = target.value;

    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.selectedCollection === 'all') {
      this.filteredBoxes = this.uniqueBoxes;
      return;
    }

    this.filteredBoxes = this.uniqueBoxes.filter(
      (box) => box.collection === this.selectedCollection,
    );
  }

  onCollectibleClick(box: any): void {
    if (!box.unlocked) return;

    this.router.navigate(['/collection-detail', box.type]);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
