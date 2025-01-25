import { Chat } from '../models/chat-model';
import { Settings } from '../settings';
import { marked } from 'marked';

export class ChatView {
  private chatsElement!: HTMLElement | null;
  private questionElement!: HTMLTextAreaElement;
  private sendButton!: HTMLButtonElement;

  constructor() {
    this.chatsElement = document.querySelector<HTMLDivElement>(
      Settings.CHAT_CLASS
    );
    if (this.chatsElement === null) {
      throw new Error('chatsElement is undefined');
    }
    document.body.appendChild(this.chatsElement);
    this.initTextArea();
  }

  initTextArea() {
    const inputWrapper = document.createElement('div');
    inputWrapper.className = Settings.INPUT_WRAPPER_CLASS;

    this.questionElement = document.createElement('textarea');
    this.questionElement.className = Settings.INPUT_CONTAINER_CLASS;
    this.questionElement.addEventListener('input', () => {
      this.questionElement.style.height = 'auto';
      this.questionElement.style.height =
        Math.min(this.questionElement.scrollHeight, 10 * 1.6 * 16) + 'px';
      const trimmedValue = this.questionElement.value.trim();
      this.sendButton.disabled = trimmedValue.length === 0;
    });

    this.sendButton = document.createElement('button');
    this.sendButton.className = Settings.SEND_BUTTON_CLASS;
    this.sendButton.textContent = 'Send';

    inputWrapper.appendChild(this.questionElement);
    inputWrapper.appendChild(this.sendButton);
    document.body.appendChild(inputWrapper);
    this.sendButton.disabled = true;
  }

  private scrollToBottom() {
    if (this.chatsElement) {
      this.chatsElement.scrollTop = this.chatsElement.scrollHeight;
    }
  }

  newQuestion(callback: (question: string) => void) {
    this.questionElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        callback(this.questionElement.value);
        this.questionElement.value = '';
        this.sendButton.disabled = true;
      }
    });
    this.sendButton.addEventListener('click', () => {
      callback(this.questionElement.value);
      this.questionElement.value = '';
      this.sendButton.disabled = true;
    });
  }

  displayChat(chat: Chat) {
    const questionElement = document.createElement('p');
    const responseElement = document.createElement('div');
    questionElement.textContent = chat.question;

    responseElement.innerHTML = marked(chat.response) as string;

    questionElement.className = 'chat-question';
    responseElement.className = 'chat-response';

    this.chatsElement?.appendChild(questionElement);
    this.chatsElement?.appendChild(responseElement);
  }

  displayChats(chats: Chat[]) {
    if (this.chatsElement) {
      this.chatsElement.innerHTML = '';
    }
    chats.forEach((chat: Chat) => {
      this.displayChat(chat);
    });
    this.scrollToBottom();
  }
}
