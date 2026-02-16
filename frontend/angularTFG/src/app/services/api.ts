import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(private http: HttpClient) {}

  login(body: any) {
    return this.http.post('/api/login', body);
  }

  loginMock(body: any) {
      const user = this.mockUsers.find(
        u => u.email === body?.email && u.password === body?.password
      );
    return of(user ?? null);
  }

  private mockUsers = [
    {
      id: 1,
      nombre: 'prueba',
      email: 'test1@example.com',
      password: '123456',
      roles: ['user'],
      token: 'mock-token-1',
      boxesOpened: [
        { id: 1, hasSpecial: false },
        { id: 2, hasSpecial: true },
        { id: 3, hasSpecial: false }
      ],
      trades: [
        { id: 1, date: '2025-01-01' }
      ]
    },
    {
      id: 2,
      nombre: 'collector',
      email: 'test2@example.com',
      password: '123456',
      roles: ['user'],
      token: 'mock-token-2',
      boxesOpened: [
        { id: 1, hasSpecial: true },
        { id: 2, hasSpecial: true },
        { id: 3, hasSpecial: true },
        { id: 4, hasSpecial: false }
      ],
      trades: [
        { id: 1, date: '2025-01-01' },
        { id: 2, date: '2025-01-05' }
      ]
    }
  ];

}
