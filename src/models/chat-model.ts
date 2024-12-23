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
}
