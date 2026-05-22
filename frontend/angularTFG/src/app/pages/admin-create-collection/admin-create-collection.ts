import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Modal } from '../../components/modal/modal';

interface BoxWizard {
  number: number | null;
  type: string;
  collection: string;
  collectionUrl: string;
  hasSpecial: boolean;
  description: string;
  imageUrl: string;
  noForBuying: boolean;
}

@Component({
  selector: 'app-admin-create-collection',
  standalone: true,
  imports: [FormsModule, CommonModule, Modal],
  templateUrl: './admin-create-collection.html',
  styleUrl: './admin-create-collection.scss',
})
export class AdminCreateCollection {
  step = 1;

  collectionName = '';
  collectionUrl = '';

  existingBoxes: any[] = [];
  createdBoxes: BoxWizard[] = [];

  currentBox: BoxWizard = this.resetBox();

  collections: string[] = [];
  collectionUrlMap: { [key: string]: string } = {};
  isExistingCollection = false;

  showErrorModal = false;
  modalMessage = '';
  showSuccessModal = false;

  constructor(
    private api: Api,
    private router: Router,
  ) {}

  ngOnInit() {
    this.api.getAllBoxes().subscribe((boxes: any) => {
      this.existingBoxes = boxes;

      const map = new Map<string, string>();

      for (const box of boxes) {
        if (!map.has(box.collection)) {
          map.set(box.collection, box.collectionUrl);
        }
      }

      this.collections = Array.from(map.keys());
      this.collectionUrlMap = Object.fromEntries(map.entries());
    });
  }

  openCatalog(): void {
    this.router.navigate(['/admin-catalog']);
  }

  nextStep() {
    if (this.step < 3) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  addBox() {
    // Validación contra BD
    const duplicatedInDatabase = this.existingBoxes.some(
      (b: any) =>
        b.collection === this.collectionName &&
        b.number === this.currentBox.number,
    );

    // Validación contra cajas añadidas en esta sesión
    const duplicatedInWizard = this.createdBoxes.some(
      (b) =>
        b.collection === this.collectionName &&
        b.number === this.currentBox.number,
    );

    if (duplicatedInDatabase || duplicatedInWizard) {
      this.modalMessage =
        `Ya existe una caja número ${this.currentBox.number} ` +
        `en la colección "${this.collectionName}".`;

      this.showErrorModal = true;

      return;
    }

    this.createdBoxes.push({
      ...this.currentBox,
      collection: this.collectionName,
      collectionUrl: this.collectionUrl,
    });

    this.currentBox = this.resetBox();
  }

  onCollectionChange(value: string) {
    this.collectionName = value;

    if (this.collectionUrlMap[value]) {
      this.collectionUrl = this.collectionUrlMap[value];
      this.isExistingCollection = true;
    } else {
      this.collectionUrl = '';
      this.isExistingCollection = false;
    }
  }

  removeBox(index: number) {
    this.createdBoxes.splice(index, 1);
  }

  resetBox(): BoxWizard {
    return {
      number: null,
      type: '',
      collection: '',
      collectionUrl: '',
      hasSpecial: false,
      description: '',
      imageUrl: '',
      noForBuying: false,
    };
  }

  saveCollection() {
    if (!this.collectionName || this.createdBoxes.length === 0) return;

    const payload = {
      boxes: this.createdBoxes.map((b) => ({
        number: b.number,
        type: b.type,
        collection: this.collectionName,
        collectionUrl: this.collectionUrl,
        hasSpecial: b.hasSpecial,
        description: b.description,
        imageUrl: b.imageUrl,
        noForBuying: b.noForBuying,
      })),
    };

    this.api.createOrUpdateBoxes(payload).subscribe({
      next: () => {
        this.modalMessage = 'Colección añadida correctamente ✨';
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error(err);
        alert('Error creando colección');
      },
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/admin-home']);
  }

  goBack(): void {
    this.router.navigate(['/admin-home']);
  }
}
