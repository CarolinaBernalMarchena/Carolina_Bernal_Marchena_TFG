import { Component, OnInit } from '@angular/core';
import { Api, BoxOpened } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-create-trade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-trade.html',
  styleUrl: './create-trade.scss',
})
export class CreateTrade implements OnInit {
  selectedBox?: BoxOpened;
  requestedBox?: BoxOpened;
  duplicatedBoxes: BoxOpened[] = [];
  availableBoxes: BoxOpened[] = [];
  filteredBoxesByCollection: BoxOpened[] = [];
  selectedCollection: string = '';
  offerCollection: string = 'all';
  offerOnlySpecial: boolean = false;
  requestCollection: string = 'all';
  requestOnlySpecial: boolean = false;
  searchText: string = '';

  constructor(
    private api: Api,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUserCollection();
    this.loadAllBoxes();
  }

  private loadUserCollection(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.api.getMyCollection(user.id).subscribe({
      next: (data: any[]) => {
        const boxes: BoxOpened[] = data.map((item) => ({
          id: item.Box.id,
          collection: item.Box.collection,
          type: item.Box.type,
          hasSpecial: item.Box.hasSpecial,
          descripcion: item.Box.description,
          imageUrl: item.Box.imageUrl,
          repeated: item.quantity - 1,
        }));

        this.duplicatedBoxes = boxes.filter((b) => b.repeated > 0);
      },
      error: (err) => console.error('Error cargando colección', err),
    });
  }

  private loadAllBoxes(): void {
    this.api.getAllBoxes().subscribe({
      next: (data: any) => {
        this.availableBoxes = data.map((box: any) => ({
          id: box.id,
          collection: box.collection,
          type: box.type,
          hasSpecial: box.hasSpecial,
          descripcion: box.description,
          imageUrl: box.imageUrl,
          repeated: 0,
        }));
        console.log('Cajas disponibles para intercambio:', this.availableBoxes);
      },
      error: (err: any) => {
        console.error('Error cargando cajas', err);
      },
    });
  }

  proposeTrade(): void {
    if (!this.selectedBox || !this.requestedBox || !this.authService.getUser())
      return;

    this.api
      .createTradeBackend(this.selectedBox.id, this.requestedBox.id)
      .subscribe({
        next: () => alert('Intercambio propuesto correctamente'),
        error: (err) => console.error('Error creando intercambio', err),
      });
  }

  getCollections(): string[] {
    const collections = this.availableBoxes.map((b) => b.collection);
    return [...new Set(collections)];
  }

  onCollectionChange() {
    if (!this.selectedCollection) {
      this.filteredBoxesByCollection = [];
      this.requestedBox = undefined;
      return;
    }

    this.filteredBoxesByCollection = this.availableBoxes.filter(
      (box) => box.collection === this.selectedCollection,
    );

    this.requestedBox = undefined;
  }

  goBack(): void {
    this.router.navigate(['/trades']);
  }
}
