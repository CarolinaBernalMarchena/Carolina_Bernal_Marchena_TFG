import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-catalog.html',
  styleUrl: './admin-catalog.scss',
})
export class AdminCatalog implements OnInit {
  filteredBoxes: any[] = [];
  collections: string[] = [];
  selectedCollection: string = 'all';
  private allBoxes: any[] = [];

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.api.getAllBoxes().subscribe({
      next: (boxes: any) => {
        this.allBoxes = boxes;
        this.collections = [
          ...new Set<string>(boxes.map((b: any) => b.collection)),
        ];
        this.applyFilter();
      },
      error: (err) => console.error('Error cargando catálogo', err),
    });
  }

  onCollectionChange(event: Event): void {
    this.selectedCollection = (event.target as HTMLSelectElement).value;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredBoxes =
      this.selectedCollection === 'all'
        ? this.allBoxes
        : this.allBoxes.filter((b) => b.collection === this.selectedCollection);
  }

  onBoxClick(box: any): void {
    this.router.navigate(['/admin-catalog-detail', box.type]);
  }

  goBack(): void {
    this.router.navigate(['/admin-collections']);
  }
}
