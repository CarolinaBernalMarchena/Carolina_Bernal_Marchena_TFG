import { Component, ViewChild } from '@angular/core';
import { ChatbotAvatar } from '../chatbot-avatar/chatbot-avatar';
import { ChatBubbles } from '../chat-bubbles/chat-bubbles';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [ChatbotAvatar, ChatBubbles, CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class ChatbotComponent {
  isOpen = false;

  @ViewChild(ChatBubbles)
  chatBubbles!: ChatBubbles;

  toggleChat() {
    this.isOpen = !this.isOpen;

    // mensaje inicial
    if (this.isOpen && this.chatBubbles) {
      this.chatBubbles.addMessage('¡Hola! 👋', 'bot');
    }
  }

  sendTestMessage() {
    this.chatBubbles.addMessage('Hola!', 'user');

    setTimeout(() => {
      this.chatBubbles.addMessage('Soy tu asistente 😊', 'bot');
    }, 500);
  }
}
