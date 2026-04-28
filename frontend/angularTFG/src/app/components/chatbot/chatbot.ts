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

    //Mensaje inicial
    if (this.isOpen && this.chatBubbles) {
      this.chatBubbles.enviarMensaje('¡Hola! 👋', 'bot');
    }
  }
}
