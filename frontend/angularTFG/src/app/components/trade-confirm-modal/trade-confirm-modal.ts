import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trade-confirm-modal',
  imports: [],
  templateUrl: './trade-confirm-modal.html',
  styleUrl: './trade-confirm-modal.scss',
})
export class TradeConfirmModal {
  @Input() message = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onBackdropClick(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
