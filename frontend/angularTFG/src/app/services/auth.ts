import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient, private router: Router) {}

  register(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  } 

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  updateUser(data: { name?: string; email?: string; password?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/user`, data);
  }

}