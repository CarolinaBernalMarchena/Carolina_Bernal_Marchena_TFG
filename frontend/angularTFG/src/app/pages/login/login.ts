import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          if (response?.token) {
            this.authService.setToken(response.token);
            this.authService.setUser(response.user);

            this.router.navigate(['/home']);
          } else {
            alert('Usuario o contraseña incorrectos');
          }
        },
        error: () => {
          alert('Error en el login');
        },
      });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
