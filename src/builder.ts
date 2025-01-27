import { ChatController } from './controllers/chat-controller';
import { ChatModel } from './models/chat-model';
import { ChatView } from './views/chat-view';
import { SourceController } from './controllers/source-controller';
import { SourceModel } from './models/chat-model';
import { SourceView } from './views/source-view';

export class ChatBuilder {
  private chatView!: ChatView;
  private chatModel!: ChatModel;
  private chatController!: ChatController;

  private sourceView!: SourceView;
  private sourceModel!: SourceModel;
  private sourceController!: SourceController;

  withView() {
    this.chatView = new ChatView();
    this.sourceView = new SourceView();
    return this;
  }

  withModel() {
    this.chatModel = new ChatModel();
    this.sourceModel = new SourceModel();
    return this;
  }

  withController() {
    if (!this.chatModel || !this.chatView) {
      throw new Error('Missing chat model/view');
    }
    this.chatController = new ChatController(this.chatModel, this.chatView);

    if (!this.sourceModel || !this.sourceView) {
      throw new Error('Missing source model/view');
    }
    this.sourceController = new SourceController(
      this.sourceModel,
      this.sourceView
    );

    return this;
  }
}
