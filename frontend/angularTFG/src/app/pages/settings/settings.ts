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
  selectedProfilePicture: string = '';
  tempProfilePicture: string = '';
  showAvatarModal: boolean = false;
  profilePictures: string[] = [
    'profile1',
    'profile2',
    'profile3',
    'profile4',
    'profile5',
    'profile6',
    'profile7',
    'profile8',
  ];

  constructor(
    private api: Api,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();

    if (!user) return;

    this.username = user.nombre;
    this.password = '';
    this.email = user.email;
    this.selectedProfilePicture = user.profilePicture || 'profile1';
    this.tempProfilePicture = this.selectedProfilePicture;
  }

  openAvatarModal() {
    this.tempProfilePicture = this.selectedProfilePicture;
    this.showAvatarModal = true;
  }

  selectProfilePicture(profilePicture: string) {
    this.tempProfilePicture = profilePicture;
    this.selectedProfilePicture = profilePicture;
    this.showAvatarModal = false;
  }

  saveChanges() {
    const data: any = {};

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

    if (this.selectedProfilePicture) {
      data.profilePicture = this.selectedProfilePicture;
    }

    this.authService.updateUser(data).subscribe({
      next: (res) => {
        if (!res || !res.user) {
          console.error('Respuesta inválida del servidor');
          return;
        }

        const updatedUser = res.user;

        localStorage.setItem('user', JSON.stringify(updatedUser));

        //Limpiamos campos sensibles
        this.password = '';
        this.currentPassword = '';

        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error al actualizar al usuario', err);
      },
    });
  }

  goBackToProfile() {
    this.router.navigate(['/profile']);
  }
}
