export class Chat {
  question!: string;
  response!: string;
  constructor(question: string, response: string) {
    this.question = question;
    this.response = response;
  }
}

export class ChatModel {
  private chats: Chat[] = [];

  getChats(): Chat[] {
    return this.chats;
  }

  addChat(chat: Chat): void {
    this.chats.push(chat);
  }

  updateLastChat(response: string): void {
    if (this.chats.length > 0) {
      this.chats[this.chats.length - 1].response = response;
    }
  }
}
export class Source {
  sourceType: string;
  sourcePath: string;

  constructor(sourceType: string, sourcePath: string) {
    this.sourceType = sourceType;
    this.sourcePath = sourcePath;
  }
}

export class SourceModel {
  private sources: Source[] = [];

  setSources(sources: Source[]) {
    this.sources = sources;
  }

  addSource(source: Source) {
    this.sources.push(source);
  }

  getSources(): Source[] {
    return this.sources;
  }
}
