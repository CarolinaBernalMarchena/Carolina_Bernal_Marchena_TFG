import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Api, BoxOpened } from '../../services/api';

@Component({
  selector: 'app-admin-catalog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-catalog-detail.html',
  styleUrl: './admin-catalog-detail.scss',
})
export class AdminCatalogDetail implements OnInit {
  selectedBox: BoxOpened | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: Api,
  ) {}

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');

    if (!type) {
      this.router.navigate(['/admin-catalog']);
      return;
    }

    this.api.getAllBoxes().subscribe({
      next: (boxes: any) => {
        this.selectedBox = boxes.find((b: any) => b.type === type);
      },
      error: (err) => console.error('Error cargando coleccionable', err),
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-catalog']);
  }
}
