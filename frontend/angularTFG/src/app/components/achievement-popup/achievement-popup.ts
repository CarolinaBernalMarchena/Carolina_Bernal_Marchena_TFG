import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementNotification } from '../../services/achievement-notification';
import { ALL_ACHIEVEMENTS } from '../../constants/archievements_object';

@Component({
  selector: 'app-achievement-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievement-popup.html',
  styleUrls: ['./achievement-popup.scss'],
})
export class AchievementPopupComponent implements OnInit {
  visible = false;

  contenido = '¡Has desbloqueado un nuevo logro!';
  titulo = '¡Nuevo logro!';

  constructor(private achievementService: AchievementNotification) {}
  isOpen = false;

  open(titulo: string, contenido: string) {
    this.isOpen = true;
    this.titulo = titulo;

    this.contenido = contenido;
  }

  close() {
    this.isOpen = false;
  }

  ngOnInit(): void {
    this.achievementService.achievement$.subscribe((id) => {
      if (!id) return;
      ALL_ACHIEVEMENTS.filter((a) => a.id === id).find((a) => {
        console.log('popup recibió:', id);
        this.open(a.name, a.description);
      });
    });
  }
}
