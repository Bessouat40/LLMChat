import { ChatController } from './controllers/chat-controller';
import { ChatModel } from './models/chat-model';
import { ChatView } from './views/chat-view';

export class ChatBuilder {
  private chatView!: ChatView;
  private chatModel!: ChatModel;
  private chatController!: ChatController;
  withView() {
    this.chatView = new ChatView();
    return this;
  }
  withModel() {
    this.chatModel = new ChatModel();
    return this;
  }
  withController() {
    if (this.chatModel === undefined) {
      throw new Error('A chat model is required to build your chat controller');
    }
    if (this.chatView === undefined) {
      throw new Error('A chat model is required to build your chat controller');
    }
    this.chatController = new ChatController(this.chatModel, this.chatView);
    return this;
  }
}
