import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(email: string, password: string) {
    (this.authService.login({ email, password }) as any).subscribe({
      next: (response: any) => {
        if (response?.token) {
          this.authService.setToken(response.token);
          this.authService.setUser(response.user);
          this.router.navigate(['/home']);
          console.log('Login successful:', response);
        } else {
          console.log('Usuario o contraseña incorrectos');
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: (error: any) => {
        console.error('Login failed:', error);
      },
    });
  }

  private setLocalStorage(key: string, value: any) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      console.warn('localStorage no disponible en este contexto');
    }
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}