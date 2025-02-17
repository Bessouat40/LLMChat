import { Chat } from '../models/chat-model';
import { Settings } from '../settings';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

marked.setOptions({
  highlight: (code: string, language: string) => {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  },
} as any);

export class ChatView {
  private chatsElement!: HTMLElement;
  private questionElement!: HTMLTextAreaElement;
  private sendButton!: HTMLButtonElement;

  constructor() {
    this.chatsElement = document.querySelector<HTMLDivElement>(
      Settings.CHAT_CLASS
    )!;
    if (!this.chatsElement) {
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
    this.sendButton.textContent = 'Envoyer';

    inputWrapper.appendChild(this.questionElement);
    inputWrapper.appendChild(this.sendButton);
    document.body.appendChild(inputWrapper);
    this.sendButton.disabled = true;
  }

  private scrollToBottom() {
    this.chatsElement.scrollTo({
      top: this.chatsElement.scrollHeight,
      behavior: 'smooth',
    });
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

  async displayChat(chat: Chat) {
    const questionElement = document.createElement('p');
    const responseElement = document.createElement('div');
    questionElement.textContent = chat.question;

    // Rendu Markdown avec coloration syntaxique
    responseElement.innerHTML = await marked(chat.response);

    questionElement.className = 'chat-question';
    responseElement.className = 'chat-response';

    this.chatsElement.appendChild(questionElement);
    this.chatsElement.appendChild(responseElement);
  }

  addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock) => {
      const container = document.createElement('div');
      container.className = 'code-container';

      const preElement = codeBlock.parentElement;
      if (!preElement) return;

      preElement.parentNode?.insertBefore(container, preElement);

      container.appendChild(preElement);

      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';

      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(codeBlock.textContent || '');
        copyButton.textContent = 'Copied !';
        setTimeout(() => (copyButton.textContent = 'Copy'), 2000);
      });

      container.appendChild(copyButton);
    });
  }

  async displayChats(chats: Chat[]) {
    this.chatsElement.innerHTML = '';

    await Promise.all(chats.map((chat) => this.displayChat(chat)));

    this.scrollToBottom();
    this.addCopyButtons();
  }
}
