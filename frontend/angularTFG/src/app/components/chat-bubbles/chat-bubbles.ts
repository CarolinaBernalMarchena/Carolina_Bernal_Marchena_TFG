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

  addMessage(text: string, from: 'user' | 'bot') {
    this.messages.push({ text, from });

    if (this.messages.length > 4) {
      this.messages.shift();
    }
  }

  //TEST
  testMessages() {
    this.addMessage('Hola!', 'user');
    this.addMessage('Hola 👋 ¿en qué puedo ayudarte?', 'bot');
    this.addMessage('Quiero ver mi colección', 'user');
    this.addMessage('Te llevo ahora mismo', 'bot');
    this.addMessage('Mensaje extra', 'user');
  }
}
