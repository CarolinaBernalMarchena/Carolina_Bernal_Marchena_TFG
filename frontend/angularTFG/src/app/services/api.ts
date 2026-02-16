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
    const usuario = {
      id: 1,
      nombre: 'prueba',
      email: body?.email ?? 'test@example.com',
      password: body?.password ?? 'test-password',
      roles: ['user'],
      token: 'mock-token-123'
    };
    return of(usuario);
  }

}
