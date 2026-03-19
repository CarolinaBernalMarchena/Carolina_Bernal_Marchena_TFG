import { Component, OnInit } from '@angular/core';
import { Api, BoxOpened } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-trade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-trade.html',
  styleUrl: './create-trade.scss',
})
export class CreateTrade implements OnInit {
  selectedMyBoxId?: number;
  requestedBoxId?: number;

  duplicatedBoxes: BoxOpened[] = [];
  availableBoxes: BoxOpened[] = [];

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUserCollection();
    this.loadAllBoxes();
  }

  private loadUserCollection(): void {
    this.api.getMyCollection().subscribe({
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
      },
      error: (err: any) => {
        console.error('Error cargando cajas', err);
      },
    });
  }

  proposeTrade(): void {
    if (!this.selectedMyBoxId || !this.requestedBoxId) return;

    this.api
      .createTradeBackend({
        offeredBoxId: this.selectedMyBoxId,
        requestedBoxId: this.requestedBoxId,
      })
      .subscribe({
        next: () => alert('Intercambio propuesto correctamente'),
        error: (err) => console.error('Error creando intercambio', err),
      });
  }

  goBack(): void {
    this.router.navigate(['/trades']);
  }
}
