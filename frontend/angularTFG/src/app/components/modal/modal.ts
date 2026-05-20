import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgxConfettiExplosionComponent } from '@jjmhalew/ngx-confetti-explosion';

@Component({
  selector: 'app-modal',
  imports: [NgxConfettiExplosionComponent],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  @Input() type: 'success' | 'error' = 'success';
  @Input() message = '';
  @Input() imageUrl = '';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
