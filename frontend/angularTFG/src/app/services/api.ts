import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth';

export interface BoxOpened {
  id: number;
  collection: string;
  type: string;
  hasSpecial: boolean;
  descripcion: string;
  repeated: number;
  imageUrl: string;
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
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  unlocked: boolean;
}

export interface Trade {
  id: number;
  date: string;
  ownerId: number;
  ownerName: string;
  requestedBoxId: number;
  offeredBoxId: number;
  requestedBoxName: string;
  offeredBoxName: string;
  status: boolean;
  acceptedBy?: number;
  offeredBoxUrl?: string;
  requestedBoxUrl?: string;
  offeredBox?: BoxOpened;
  requestedBox?: BoxOpened;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = 'http://localhost:3000/api';
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  // =========================
  // AUTH
  // =========================

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // =========================
  // TRADES
  // =========================

  getTrades() {
    return this.http.get('http://localhost:3001/trades', {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  acceptTrade(id: number): Observable<any> {
    return this.http.put(`http://localhost:3001/trades/${id}/accept`, null, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  deleteTradeBackend(tradeId: number) {
    return this.http.delete(`http://localhost:3001/trades/${tradeId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  openRandomBox(collection: string) {
    const token = localStorage.getItem('token');

    return this.http.post(
      `http://localhost:3001/open-random-box/${collection}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  createTradeBackend(offeredBoxId: number, requestedBoxId: number) {
    const data = {
      offeredBoxId: offeredBoxId,
      requestedBoxId: requestedBoxId,
    };
    return this.http.post('http://localhost:3001/trades', data, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  // =========================
  // BOXES
  // =========================

  getShopBoxes() {
    return this.http.get('http://localhost:3001/shop-boxes');
  }

  getAllBoxes() {
    return this.http.get('http://localhost:3001/boxes', {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  // =========================
  // USERS
  // =========================

  getProfileStats() {
    return this.http.get<any>('http://localhost:3001/profile-stats');
  }
  /*, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }*/

  getMyCollection(userId: number): Observable<any> {
    return this.http.get(`http://localhost:3001/my-collection/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  // =========================
  // BACKEND
  // =========================

  addCollectibleToUser(collectibleId: number, userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/${userId}/collectibles/${collectibleId}`,
      {},
    );
  }

  removeCollectibleFromUser(
    collectibleId: number,
    userId: number,
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/users/${userId}/collectibles/${collectibleId}`,
    );
  }

  // =========================
  // ACHIEVEMENTS
  // =========================

  getAchievements(): Observable<any> {
    return this.http.get('http://localhost:3001/achievements', {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }
}
