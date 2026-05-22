import { Component, OnInit } from '@angular/core';
import { ApexAnnotations } from 'apexcharts';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../components/modal/modal';
import { Api, BoxOpened } from '../../services/api';

@Component({
  selector: 'app-admin-create-special-trade',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './admin-create-special-trade.html',
  styleUrl: './admin-create-special-trade.scss',
})
export class AdminCreateSpecialTrade implements OnInit {
  allBoxes: BoxOpened[] = [];

  selectedOfferedBox?: BoxOpened;
  selectedRequestedBox?: BoxOpened;

  showModal = false;
  modalMessage = '';

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadBoxes();
  }

  loadBoxes(): void {
    this.api.getAllBoxes().subscribe({
      next: (data: any) => {
        this.allBoxes = data;
      },
    });
  }

  createTrade(): void {
    if (!this.selectedOfferedBox || !this.selectedRequestedBox) {
      return;
    }

    this.api
      .createSpecialTrade(
        this.selectedOfferedBox.id,
        this.selectedRequestedBox.id,
      )
      .subscribe({
        next: () => {
          this.modalMessage = 'Intercambio especial creado';
          this.showModal = true;
        },
        error: (err) => {
          this.modalMessage =
            err.error?.message || 'Error creando el intercambio';
          this.showModal = true;
        },
      });
  }

  onModalClose(): void {
    this.router.navigate(['/admin-special-trades']);
  }

  goBack(): void {
    this.router.navigate(['/admin-special-trades']);
  }
}
