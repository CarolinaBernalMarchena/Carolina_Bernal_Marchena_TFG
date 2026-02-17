import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

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
  notifications: boolean = false;

  constructor(private api: Api, private router: Router) {}

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.username = user.nombre;
    this.notifications = user.notifications;
  }

  saveChanges() {
    this.api.updateCurrentUser({
      nombre: this.username,
      password: this.password,
      notifications: this.notifications
    }).subscribe(() => {
      this.router.navigate(['/profile']);
    });
  }

  goBackToProfile() {
    this.router.navigate(['/profile']);
  }
}