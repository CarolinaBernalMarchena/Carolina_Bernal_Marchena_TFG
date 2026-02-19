import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface BoxOpened {
  id: number;
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
  offeredBoxId: number;
  requestedBoxId: number;
  status: 'open' | 'closed';
  acceptedBy?: number;
}

export const MOCK_BOXES_OPENED: Omit<BoxOpened, 'repetido' | 'date'>[] = [
  {
    id: 1,
    hasSpecial: true,
    type: 'dragon',
    descripcion: 'Dragón legendario',
    imageUrl: 'https://i.imgur.com/JuFQ3XX.jpeg'
  },
  {
    id: 2,
    hasSpecial: false,
    type: 'knight',
    descripcion: 'Caballero oscuro',
    imageUrl: 'https://i.imgur.com/JuFQ3XX.jpeg'
  }
];

export interface Trade {
  id: number;
  date: string;
  ownerId: number;
  offeredBoxId: number;
  requestedBoxId: number;
  status: 'open' | 'closed';
  acceptedBy?: number;
}

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
      boxesOpened: this.generateRandomBoxes(5),
      trades: [
        {
          id: 1,
          date: '2025-01-01',
          ownerId: 1,
          offeredBoxId: 1,
          requestedBoxId: 2,
          status: 'closed',
          acceptedBy: 2
        }
      ],
      notifications: true,
      achievements: [
      { id: 1, unlocked: true },
      { id: 2, unlocked: true },
      { id: 3, unlocked: true },
      { id: 4, unlocked: false },
      { id: 5, unlocked: false },
      { id: 6, unlocked: false }
      ]
    },
    {
      id: 2,
      nombre: 'collector',
      email: 'test2@example.com',
      password: '123456',
      roles: ['user'],
      token: 'mock-token-2',
      boxesOpened: this.generateRandomBoxes(3),
      trades: [
        {
          id: 1,
          date: '2025-01-01',
          ownerId: 2,
          offeredBoxId: 2,
          requestedBoxId: 1,
          status: 'closed',
          acceptedBy: 1
        }
      ],
      notifications: false,
      achievements: [
      { id: 1, unlocked: true },
      { id: 2, unlocked: false },
      { id: 3, unlocked: false },
      { id: 4, unlocked: false },
      { id: 5, unlocked: false },
      { id: 6, unlocked: false }
      ]
    }
  ];

  private currentUser: User = this.mockUsers[0];

  private generateRandomBoxes(count: number): BoxOpened[] {
    const result: BoxOpened[] = [];

    for (let i = 0; i < count; i++) {
      const random =
        MOCK_BOXES_OPENED[Math.floor(Math.random() * MOCK_BOXES_OPENED.length)];

      result.push({
        ...random,
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

  private trades: Trade[] = [
    {
      id: 1,
      date: '2025-01-10',
      ownerId: 2,
      offeredBoxId: 1,
      requestedBoxId: 2,
      status: 'open'
    }
  ];

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
  }){

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

  getOpenTrades() {
    return of(this.trades.filter(t => t.status === 'open'));
  }

  createTrade(data: {
    offeredBoxId: number;
    requestedBoxId: number;
  }){
    const newTrade: Trade = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ownerId: this.currentUser.id,
      offeredBoxId: data.offeredBoxId,
      requestedBoxId: data.requestedBoxId,
      status: 'open'
    };

    this.trades.push(newTrade);

    return of(newTrade);
  }

  acceptTrade(tradeId: number): Observable<Trade | null> {
    const trade = this.trades.find(t => t.id === tradeId);
    if (!trade) return of(null);

    trade.status = 'closed';
    trade.acceptedBy = this.currentUser.id;

    return of(trade);
  }

  getUserById(id: number) {
    return this.mockUsers.find(u => u.id === id);
  }

}