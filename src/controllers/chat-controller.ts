import { ChatView } from '../views/chat-view';
import { Chat, ChatModel } from '../models/chat-model';

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

  newQuestion(question: string): void {
    const response = 'new response';
    const newChat = new Chat(question, response);
    if (this.model !== undefined) {
      this.model.addChat(newChat);
    }
    this.displayChats();
  }
}
