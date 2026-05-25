import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, Modal],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: FormGroup;
  showModal = false;
  modalMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const formData = {
      ...this.registerForm.value,
      role: 'user',
    };

    this.authService.register(formData).subscribe({
      next: () => {
        this.modalMessage = `¡Usuario creado correctamente! Haz login para comenzar a usar la aplicación 🎉`;
        this.showModal = true;
      },
      error: (err) => {
        console.error('Error al registrar usuario', err);
        alert('Error al registrar usuario');
      },
    });
  }

  onModalClose(): void {
    this.showModal = false;
    this.router.navigate(['/login']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
