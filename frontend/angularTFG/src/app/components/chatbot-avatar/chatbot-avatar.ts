import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-chatbot-avatar',
  imports: [],
  templateUrl: './chatbot-avatar.html',
  styleUrl: './chatbot-avatar.scss',
})
export class ChatbotAvatar {
  mouseX = 0;
  mouseY = 0;

  isHover = false;
  isActive = false;
  isClick = false;
  isBlinking = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const pupils = document.querySelectorAll('.pupil');

    pupils.forEach((pupil: any) => {
      const eye = pupil.parentElement;
      const rect = eye.getBoundingClientRect();

      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      let dx = event.clientX - eyeCenterX;
      let dy = event.clientY - eyeCenterY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxDistance = 10;

      if (distance > maxDistance) {
        dx = (dx / distance) * maxDistance;
        dy = (dy / distance) * maxDistance;
      }

      pupil.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }

  ngOnInit() {
    this.startBlinking();
  }

  startBlinking() {
    setInterval(
      () => {
        this.isBlinking = true;

        setTimeout(() => {
          this.isBlinking = false;
        }, 150);
      },
      3000 + Math.random() * 2000,
    );
  }

  onClick() {
    this.isClick = true;

    setTimeout(() => {
      this.isActive = false;
    }, 300);
  }

  onMouseDown() {
    this.isClick = true;
  }

  onMouseUp() {
    this.isClick = false;
  }

  resetState() {
    this.isHover = false;
    this.isClick = false;
  }
}
