import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})

export class Settings {

  username: string = '';
  password: string = '';
  currentPassword: string = '';
  email: string = '';
  notifications: boolean = false;

  constructor(private api: Api, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.username = user.nombre;
    this.password = user.password;
    this.email = user.email;
    this.notifications = user.notifications;
  }

  saveChanges() {

    const data: any = { };

    if (this.password && this.password.trim() !== '') {
      data.password = this.password;
      data.currentPassword = this.currentPassword;
    }
    if (this.username && this.username.trim() !== '') {
      data.name = this.username;
    }
    if (this.email && this.email.trim() !== '') {
      data.email = this.email;
    }

    this.authService.updateUser(data).subscribe({
      next: (res) => {
        const updatedUser = res.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error al actualizar al usuario', err);
      }
    });
  }

  goBackToProfile() {
    this.router.navigate(['/profile']);
  }
}