import { ChatView } from '../views/chat-view';
import { Chat, ChatModel } from '../models/chat-model';
import { ApiService } from '../services/apiService';

export class ChatController {
  private model!: ChatModel;
  private view!: ChatView;

  constructor(model: ChatModel, view: ChatView) {
    this.model = model;
    this.view = view;

    this.displayChats();
    this.view.newQuestion((question: string) => this.newQuestion(question));
  }

  displayChats() {
    const chats = this.model.getChats();
    this.view.displayChats(chats);
  }

  async newQuestion(question: string): Promise<void> {
    const newChat = new Chat(question, '⏳');
    if (this.model !== undefined) {
      this.model.addChat(newChat);
    }
    this.displayChats();
    const response = await ApiService.postQuestion(question);
    if (this.model !== undefined) {
      this.model.updateLastChat(response);
    }
    this.displayChats();
  }
}
