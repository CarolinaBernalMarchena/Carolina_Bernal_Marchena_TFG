import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(private api: Api, private router: Router) {}

  login(username: string, password: string) {
    console.log('Username:', username);
    console.log('Password:', password);

    this.api.loginMock({ username, password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });

  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
