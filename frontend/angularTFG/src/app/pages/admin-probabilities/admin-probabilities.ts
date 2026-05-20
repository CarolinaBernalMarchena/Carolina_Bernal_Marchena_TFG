import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api, CollectionProbability } from '../../services/api';
import { Modal } from '../../components/modal/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-probabilities',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './admin-probabilities.html',
  styleUrl: './admin-probabilities.scss',
})
export class AdminProbabilities {
  probabilities: CollectionProbability[] = [];

  loading = true;

  showModal = false;
  modalMessage = '';

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProbabilities();
  }

  loadProbabilities() {
    this.api.getCollectionProbabilities().subscribe({
      next: (data) => {
        this.probabilities = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);

        this.modalMessage = 'Error cargando las probabilidades';

        this.showModal = true;

        this.loading = false;
      },
    });
  }

  saveProbability(probability: CollectionProbability) {
    if (
      probability.specialProbability < 0 ||
      probability.specialProbability > 100
    ) {
      this.modalMessage = 'La probabilidad debe estar entre 0 y 100';
      this.showModal = true;
      return;
    }

    // Calculamos normalProbability antes de enviar
    probability.normalProbability = 100 - probability.specialProbability;

    this.api.saveCollectionProbability(probability).subscribe({
      next: () => {
        this.modalMessage = 'Probabilidad guardada correctamente';

        this.showModal = true;
      },
      error: (err) => {
        console.error(err);

        this.modalMessage = 'Error guardando la probabilidad';
        this.showModal = true;
      },
    });
  }

  closeModal() {
    this.showModal = false;
  }

  goBack() {
    this.router.navigate(['/admin-home']);
  }
}
