import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Api, BoxOpened } from '../../services/api';
import { AuthService } from '../../services/auth';

interface CollectionItem extends BoxOpened {
  total: number;
  repeated: number;
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
  selectedBox: CollectionItem | undefined;

  constructor(
    private router: Router,
    private api: Api,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCollection();
    this.route.paramMap.subscribe((params) => {
      const type = params.get('type');
      if (type && this.collection.length) {
        this.selectedBox = this.collection.find((box) => box.type === type);
      }
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
        // Transformar los datos del backend al formato CollectionItem
        const boxes: CollectionItem[] = data.map((item: any) => ({
          id: item.Box.id,
          collection: item.Box.collection,
          type: item.Box.type,
          hasSpecial: item.Box.hasSpecial,
          descripcion: item.Box.description,
          imageUrl: item.Box.imageUrl,
          total: item.quantity, // backend ya tiene quantity
          repeated: item.quantity - 1,
        }));

        this.buildCollection(boxes);

        // Recalcular selectedBox en caso de que la URL ya tenga type
        const type = this.route.snapshot.paramMap.get('type');
        if (type) {
          this.selectedBox = this.collection.find((box) => box.type === type);
        }
      },
      error: (err) => {
        console.error('Error cargando colección', err);
      },
    });
  }

  private buildCollection(boxes: CollectionItem[]): void {
    const map: { [type: string]: CollectionItem } = {};

    boxes.forEach((box) => {
      if (!map[box.type]) {
        map[box.type] = { ...box };
      } else {
        map[box.type].total += box.total;
        map[box.type].repeated = map[box.type].total - 1;
      }
    });

    this.collection = Object.values(map);
  }
  goBack(): void {
    this.router.navigate(['/collection']);
  }
}
