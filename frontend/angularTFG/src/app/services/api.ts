import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface BoxOpened {
  id: number;
  collection: string;
  type: string;
  hasSpecial: boolean;
  descripcion: string;
  date: string;
  repetido: number;
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
  status: 'open' | 'closed';
  acceptedBy?: number;
}

export const MOCK_TRADES: Trade[] = [
  {
    id: 1,
    date: '2023-01-01',
    ownerId: 0,
    ownerName: 'prueba',
    offeredBoxId: 1,
    requestedBoxName: 'Creeper',
    offeredBoxName: 'Dragón legendario',
    requestedBoxId: 3,
    status: 'open'
  }
];

export const MOCK_BOXES_OPENED: Omit<BoxOpened, 'repetido' | 'date'>[] = [
  {
    id: 1,
    hasSpecial: true,
    collection: 'medieval creatures',
    type: 'dragon',
    descripcion: 'Dragón legendario',
    imageUrl: 'https://i.imgur.com/AxZ8Mma.jpeg'
  },
  {
    id: 2,
    hasSpecial: false,
    collection: 'medieval creatures',
    type: 'knight',
    descripcion: 'Caballero oscuro',
    imageUrl: 'https://i.imgur.com/Wo0dI1A.jpeg'
  },
  {
    id: 3,
    hasSpecial: false,
    collection: 'minecraft',
    type: 'monster',
    descripcion: 'Creeper',
    imageUrl: 'https://i.imgur.com/FNkPbIz.jpeg'
  },
  {
    id: 4,
    hasSpecial: false,
    collection: 'minecraft',
    type: 'player',
    descripcion: 'Steve',
    imageUrl: 'https://i.imgur.com/4nOFTSS.jpeg'
  }
];

@Injectable({
  providedIn: 'root',
})
export class Api {

  private apiUrl = 'http://localhost:3000/api';
  private STORAGE_KEY_TRADES = 'mock_trades';
  trades: Trade[] = [];
  constructor(private http: HttpClient) {
      this.trades = this.loadTrades();
      this.trades = [...MOCK_TRADES, ...this.trades];
  }

  // =========================
  // MOCK USERS
  // =========================

  private mockUsers: User[] = [
    {
      id: 1,
      nombre: 'prueba',
      email: 'test1@example.com',
      password: '123456',
      roles: ['user'],
      token: 'mock-token-1',
      boxesOpened: this.generateRandomBoxes(5),
      trades: [],
      notifications: true,
      achievements: [
        { id: 1, unlocked: true },
        { id: 2, unlocked: true },
        { id: 3, unlocked: true },
        { id: 4, unlocked: false },
        { id: 5, unlocked: false },
        { id: 6, unlocked: false }
      ]
    }
  ];

  private currentUser: User = this.mockUsers[0];

  // =========================
  // LOCALSTORAGE TRADES
  // =========================

  private loadTrades(): Trade[] {
    const data = localStorage.getItem(this.STORAGE_KEY_TRADES);
    return data ? JSON.parse(data) : [];
  }

  private saveTrades(trades: Trade[]): void {
    localStorage.setItem(this.STORAGE_KEY_TRADES, JSON.stringify(trades));
  }

  // =========================
  // AUTH
  // =========================

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

  // =========================
  // TRADES
  // =========================

  getOpenTrades(): Observable<Trade[]> {
    return of(this.trades.filter(t => t.status === 'open'));
  }

  createTrade(data: {
    offeredBoxId: number;
    requestedBoxId: number;
  }) {

    const trades = this.trades;

    const newTrade: Trade = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ownerId: this.currentUser.id,
      ownerName: this.currentUser.nombre,
      offeredBoxId: data.offeredBoxId,
      offeredBoxName: "coleccion 1",
      requestedBoxId: data.requestedBoxId,
      requestedBoxName: "coleccion 1",
      status: 'open'
    };

    trades.push(newTrade);
    this.saveTrades(trades);

    return of(newTrade);
  }

  acceptTrade(tradeId: number): Observable<Trade | null> {

    const trades = this.trades;
    const trade = trades.find(t => t.id === tradeId);

    if (!trade) return of(null);

    trade.status = 'closed';
    trade.acceptedBy = this.currentUser.id;

    this.saveTrades(trades);

    return of(trade);
  }

  deleteTrade(tradeId: number): Observable<boolean> {

    const trades = this.trades;
    const index = trades.findIndex(t => t.id === tradeId);

    if (index === -1) return of(false);

    trades.splice(index, 1);
    this.saveTrades(trades);

    return of(true);
  }

  // =========================
  // BOXES
  // =========================

  private generateRandomBoxes(count: number): BoxOpened[] {
    const result: BoxOpened[] = [];

    for (let i = 0; i < count; i++) {
      const random =
        MOCK_BOXES_OPENED[Math.floor(Math.random() * MOCK_BOXES_OPENED.length)];

      result.push({
        ...random,
        id: Date.now() + i,
        date: new Date().toISOString().split('T')[0],
        repetido: 0
      });
    }

    return this.calculateDuplicates(result);
  }

  private calculateDuplicates(boxes: BoxOpened[]): BoxOpened[] {
    const counter: { [type: string]: number } = {};

    boxes.forEach(box => {
      counter[box.type] = (counter[box.type] || 0) + 1;
    });

    return boxes.map(box => ({
      ...box,
      repetido: counter[box.type] - 1
    }));
  }

  // =========================
  // USERS
  // =========================

  getUserById(id: number) {
    return this.mockUsers.find(u => u.id === id);
  }

  // =========================
  // FUTURE BACKEND
  // =========================

  addCollectibleToUser(collectibleId: number, userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/${userId}/collectibles/${collectibleId}`,
      {}
    );
  }

  removeCollectibleFromUser(collectibleId: number, userId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/users/${userId}/collectibles/${collectibleId}`
    );
  }
}