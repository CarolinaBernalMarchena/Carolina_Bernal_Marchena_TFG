import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AchievementPopupComponent } from './components/achievement-popup/achievement-popup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AchievementPopupComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
