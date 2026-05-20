import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { environment } from '../../environments/environment';

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
  achievements: Achievement[];
  profilePicture?: string;
}

export interface Achievement {
  achievementId: number;
  unlockedAt: string;
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

export interface TokenCoin {
  tokens: number;
}

export interface TokenHistory {
  id: number;
  userId: number;
  amount: number;
  type: 'gain' | 'spent';
  reason: string;
  date: string;
}

export interface ActivityItem {
  type: 'token' | 'trade' | 'achievement' | 'box';
  title: string;
  description: string;
  date: string;
  icon?: string;
  positive?: boolean;
}

export interface CollectionProbability {
  id?: number;
  collection: string;
  normalProbability: number;
  specialProbability: number;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = environment.apiUrl;

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

  getTrades(): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.apiUrl}/trades`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  acceptTrade(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/trades/${id}/accept`, null, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  deleteTradeBackend(tradeId: number) {
    return this.http.delete(`${this.apiUrl}/trades/${tradeId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  openRandomBox(collection: string) {
    return this.http.post(
      `${this.apiUrl}/open-random-box/${collection}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      },
    );
  }

  createTradeBackend(offeredBoxId: number, requestedBoxId: number) {
    const data = {
      offeredBoxId,
      requestedBoxId,
    };

    return this.http.post(`${this.apiUrl}/trades`, data, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  // =========================
  // BOXES
  // =========================

  getShopBoxes() {
    return this.http.get(`${this.apiUrl}/shop-boxes`);
  }

  getAllBoxes() {
    return this.http.get(`${this.apiUrl}/boxes`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  createOrUpdateBoxes(data: any) {
    return this.http.post(`${this.apiUrl}/seed-boxes`, data, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  // =========================
  // USERS
  // =========================

  getProfileStats() {
    return this.http.get<any>(`${this.apiUrl}/profile-stats`);
  }

  getMyCollection(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-collection/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  updateUser(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user`, data, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  getUserHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-history`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  // =========================
  // ACHIEVEMENTS
  // =========================

  getAchievements(): Observable<{
    achievements: Achievement[];
    newAchievements: number[];
  }> {
    return this.http.get<{
      achievements: Achievement[];
      newAchievements: number[];
    }>(`${this.apiUrl}/achievements`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  // =========================
  // TOKENS
  // =========================

  getTokens(): Observable<TokenCoin> {
    return this.http.get<TokenCoin>(`${this.apiUrl}/token`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  getTokenHistory(): Observable<TokenHistory[]> {
    return this.http.get<TokenHistory[]>(`${this.apiUrl}/token-history`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  // =========================
  // PROBABILITIES
  // =========================

  getCollectionProbabilities(): Observable<CollectionProbability[]> {
    return this.http.get<CollectionProbability[]>(
      `${this.apiUrl}/collection-probabilities`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      },
    );
  }

  saveCollectionProbability(data: CollectionProbability) {
    return this.http.post(`${this.apiUrl}/collection-probabilities`, data, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }
}
