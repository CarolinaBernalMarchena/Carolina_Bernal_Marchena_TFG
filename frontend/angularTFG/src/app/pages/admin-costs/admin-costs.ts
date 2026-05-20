import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../components/modal/modal';
import { Api, CollectionCost } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-costs',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './admin-costs.html',
  styleUrl: './admin-costs.scss',
})
export class AdminCosts implements OnInit {
  costs: CollectionCost[] = [];
  loading = true;
  savingCollection = '';
  showModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCosts();
  }

  loadCosts() {
    this.loading = true;

    this.api.getCollectionCosts().subscribe({
      next: (data) => {
        this.costs = data;
        this.loading = false;
      },

      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  saveCost(cost: CollectionCost) {
    this.savingCollection = cost.collection;

    this.api.saveCollectionCost(cost).subscribe({
      next: () => {
        this.modalType = 'success';
        this.modalMessage = `Precio de la colección ${cost.collection} actualizado correctamente`;
        this.showModal = true;
        this.savingCollection = '';
      },
      error: (error) => {
        console.error(error);
        this.modalType = 'error';
        this.modalMessage = error.error?.message || 'Error actualizando coste';
        this.showModal = true;
        this.savingCollection = '';
      },
    });
  }

  closeModal() {
    this.showModal = false;
  }

  goBack(): void {
    this.router.navigate(['/admin-home']);
  }
}
