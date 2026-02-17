import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

export interface BoxOpened {
  id: number;
  hasSpecial: boolean;
  descripcion: string;
  date: string;
  repetido: number;
  imageUrl: string;
}

export interface Trade {
  id: number;
  date: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  roles: string[];
  token: string;
  boxesOpened: BoxOpened[];
  trades: Trade[];
  notifications: boolean;
}

export const MOCK_BOXES_OPENED: BoxOpened[] = [
  {
    id: 1,
    hasSpecial: true,
    descripcion: 'Dragón legendario',
    date: '2026-02-15',
    repetido: 2,
    imageUrl: 'assets/img/dragon.png'
  },
  {
    id: 2,
    hasSpecial: false,
    descripcion: 'Caballero oscuro',
    date: '2026-02-10',
    repetido: 1,
    imageUrl: 'assets/img/knight.png'
  }
];

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(private http: HttpClient) {}

  private mockUsers: User[] = [
    {
      id: 1,
      nombre: 'prueba',
      email: 'test1@example.com',
      password: '123456',
      roles: ['user'],
      token: 'mock-token-1',
      boxesOpened: MOCK_BOXES_OPENED,
      trades: [
        { id: 1, date: '2025-01-01' }
      ],
      notifications: true
    },
    {
      id: 2,
      nombre: 'collector',
      email: 'test2@example.com',
      password: '123456',
      roles: ['user'],
      token: 'mock-token-2',
      boxesOpened: MOCK_BOXES_OPENED,
      trades: [
        { id: 1, date: '2025-01-01' },
        { id: 2, date: '2025-01-05' }
      ],
      notifications: false
    }
  ];

  private currentUser: User = this.mockUsers[0];

  login(body: any) {
    const found =
      this.mockUsers.find(
        u => u.email === body?.email && u.password === body?.password
      ) || null;

    if (found) {
      this.currentUser = found;
    }

    return of(found);
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  updateCurrentUser(data: {
    nombre?: string;
    password?: string;
    notifications?: boolean;
  }) {

    if (data.nombre !== undefined) {
      this.currentUser.nombre = data.nombre;
    }

    if (data.password !== undefined && data.password !== '') {
      this.currentUser.password = data.password;
    }

    if (data.notifications !== undefined) {
      this.currentUser.notifications = data.notifications;
    }

    return of(this.currentUser);
  }

}