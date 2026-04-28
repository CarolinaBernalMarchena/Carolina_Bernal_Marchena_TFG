import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Message {
  text: string;
  from: 'user' | 'bot';
}

@Component({
  selector: 'app-chat-bubbles',
  imports: [CommonModule],
  templateUrl: './chat-bubbles.html',
  styleUrl: './chat-bubbles.scss',
})
export class ChatBubbles {
  messages: Message[] = [];
  opcionesMensajes = [
    'Hola! ¿Cómo funciona la aplicación?',
    '¿Cómo funciona la tienda?',
    '¿Cómo funcionan los intercambios?',
    '¿Qué son los logros?',
    '¿Cómo se obtienen los tokens?',
  ];

  enviarMensaje(text: string, from: 'user' | 'bot') {
    this.messages.push({ text, from });

    if (this.messages.length > 4) {
      this.messages.shift();
    }
    if (from === 'user') {
      this.responder(text);
    }
  }

  responder(text: string) {
    setTimeout(() => {
      if (text.includes('Hola! ¿Cómo funciona la aplicación?')) {
        this.enviarMensaje(
          'Buenas! bienvenid@ a Trinketbox, la aplicación de coleccionismo e intercambio digital. Si quieres más información indícame en qué puedo ayudarte.',
          'bot',
        );
        this.opcionesMensajes = this.opcionesMensajes.filter(
          (opcion) => opcion !== text,
        );
      } else if (text.includes('¿Cómo funciona la tienda?')) {
        this.enviarMensaje(
          'En la tienda puedes comprar con tus tokens digitales distintas colecciones. Las colecciones que ofrece la tienda son aleatorias y se reponen cada 12 horas. Las cajas son coleccionables sorpresas ¡Anímate a completar una colección entera!',
          'bot',
        );
        this.opcionesMensajes = this.opcionesMensajes.filter(
          (opcion) => opcion !== text,
        );
      } else if (text.includes('¿Cómo funcionan los intercambios?')) {
        this.enviarMensaje(
          'En la página de intercambios puedes ofrecer tus coleccionables repetidos a otros usuarios a cambio de otros coleccionables distintos. También puedes solicitar intercambios a otros usuarios, ofreciendo tus coleccionables a cambio de los suyos.',
          'bot',
        );
        this.opcionesMensajes = this.opcionesMensajes.filter(
          (opcion) => opcion !== text,
        );
      } else if (text.includes('¿Qué son los logros?')) {
        this.enviarMensaje(
          'Los logros son objetivos que puedes cumplir para ganar tokens digitales. Puedes ver los logros disponibles en tu perfil. Algunos logros son coleccionar un número determinado de coleccionables, completar una colección entera, realizar un número determinado de intercambios, etc.',
          'bot',
        );
        this.opcionesMensajes = this.opcionesMensajes.filter(
          (opcion) => opcion !== text,
        );
      } else if (text.includes('¿Cómo se obtienen los tokens?')) {
        this.enviarMensaje(
          'Los tokens digitales se obtienen al cumplir logros, intercambiar coleccionables o comprando en la tiendasimplemente esperando ya que conseguiras un nuevo token cada día.',
          'bot',
        );
        this.opcionesMensajes = this.opcionesMensajes.filter(
          (opcion) => opcion !== text,
        );
      }
    }, 1000);
  }
}
