import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  message = '';
  @ViewChild('chatContent') private chatContent!: ElementRef;
  messages: { text: string; isUser: boolean }[] = [];

  constructor() { }

  ngOnInit(): void {
    // Add welcome message
    this.addBotMessage('Hello! I\'m your oil production assistant. How can I help you today?');
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      // When opening chat, scroll to bottom after a short delay to ensure animation is complete
      setTimeout(() => this.scrollToBottom(), 300);
    }
  }

  sendMessage(): void {
    if (this.message.trim()) {
      // Add user message
      this.addUserMessage(this.message);
      
      // Process message and get response
      const botResponse = this.getBotResponse(this.message);
      
      // Clear input
      this.message = '';
      
      // Add bot response with a small delay to simulate thinking
      setTimeout(() => {
        this.addBotMessage(botResponse);
      }, 500);
    }
  }

  addUserMessage(text: string): void {
    this.messages.push({ text, isUser: true });
    this.scrollToBottom();
  }

  addBotMessage(text: string): void {
    this.messages.push({ text, isUser: false });
    this.scrollToBottom();
  }
  
  private scrollToBottom(): void {
    // Use setTimeout to ensure the DOM has been updated
    setTimeout(() => {
      if (this.chatContent) {
        const element = this.chatContent.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 50);
  }

  getBotResponse(message: string): string {
    // Simple hardcoded responses based on keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello there! How can I assist you with oil production data today?';
    } else if (lowerMessage.includes('help')) {
      return 'I can help you with information about wells, production data, and analysis. What would you like to know?';
    } else if (lowerMessage.includes('well') || lowerMessage.includes('wells')) {
      return 'We have several wells in our database. You can view them in the Wells section of the application.';
    } else if (lowerMessage.includes('production')) {
      return 'Production data is available in the Production section. You can filter by date, well, or region.';
    } else if (lowerMessage.includes('chart') || lowerMessage.includes('visualization')) {
      return 'Our dashboard provides various charts and visualizations of oil production trends.';
    } else if (lowerMessage.includes('map')) {
      return 'You can view well locations on our interactive map in the Map section.';
    } else if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Let me know if you need anything else.';
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return 'Goodbye! Feel free to chat again if you have more questions.';
    } else {
      return 'I\'m not sure I understand. Could you rephrase or ask about wells, production data, or our visualization features?';
    }
  }
}
