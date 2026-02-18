import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { Achievement } from '../../services/api';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss'
})
export class Achievements implements OnInit {

  username: string = '';
  totalUnlocked: number = 0;
  achievements: Achievement[] = [];

  constructor(private api: Api, private router: Router) {}

  ngOnInit(): void {
    const user = this.api.getCurrentUser();
    this.username = user.nombre;
    this.achievements = user.achievements;
    this.totalUnlocked = this.achievements.filter(a => a.unlocked).length;
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}