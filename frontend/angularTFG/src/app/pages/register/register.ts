import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  registerForm: FormGroup;
  apiUrl = 'http://localhost:3001';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onSubmit() {

    if (this.registerForm.invalid) {
      return;
    }

    const formData = {
      ...this.registerForm.value,
      role: 'user'
    };

    this.http.post(`${this.apiUrl}/register`, formData).subscribe({
      next: (res: any) => {
        console.log('Usuario creado correctamente');
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', res.user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error al registrar usuario', err);
        alert('Este email ya está en uso');
      }
    });

  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

}