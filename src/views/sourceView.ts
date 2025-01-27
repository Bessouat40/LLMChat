import { Source } from '../models/chat-model';

export class SourceView {
  private modalOverlay: HTMLDivElement;
  private modalWindow: HTMLDivElement;

  private modalHeader: HTMLDivElement;
  private closeButton: HTMLButtonElement;

  private modalBody: HTMLDivElement;

  private sourcesList: HTMLUListElement;

  private sourceTypeSelect: HTMLSelectElement;
  private sourcePathInput: HTMLInputElement;
  private addSourceButton: HTMLButtonElement;

  private settingsButton: HTMLButtonElement;

  constructor() {
    this.settingsButton = document.createElement('button');
    this.settingsButton.classList.add('settings-button');
    this.settingsButton.textContent = '⚙️';
    this.settingsButton.addEventListener('click', () => this.show());
    document.body.appendChild(this.settingsButton);

    this.modalOverlay = document.createElement('div');
    this.modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(this.modalOverlay);

    this.modalWindow = document.createElement('div');
    this.modalWindow.classList.add('modal-window');
    this.modalOverlay.appendChild(this.modalWindow);

    this.modalHeader = document.createElement('div');
    this.modalHeader.classList.add('modal-header');

    this.closeButton = document.createElement('button');
    this.closeButton.textContent = '×';
    this.closeButton.classList.add('modal-close-button');
    this.closeButton.addEventListener('click', () => this.hide());

    this.modalHeader.appendChild(this.closeButton);
    this.modalWindow.appendChild(this.modalHeader);

    this.modalBody = document.createElement('div');
    this.modalBody.classList.add('modal-body');

    const sourcesLabel = document.createElement('h3');
    sourcesLabel.textContent = 'Knowledge :';
    this.modalBody.appendChild(sourcesLabel);

    this.sourcesList = document.createElement('ul');
    this.sourcesList.classList.add('sources-list');
    this.modalBody.appendChild(this.sourcesList);

    const formLabel = document.createElement('h3');
    formLabel.textContent = 'Add knowledge :';
    this.modalBody.appendChild(formLabel);

    this.sourceTypeSelect = document.createElement('select');
    const githubOption = document.createElement('option');
    githubOption.value = 'github';
    githubOption.text = 'GitHub Repo';

    const folderOption = document.createElement('option');
    folderOption.value = 'folder';
    folderOption.text = 'Local Folder';

    this.sourceTypeSelect.appendChild(githubOption);
    this.sourceTypeSelect.appendChild(folderOption);
    this.modalBody.appendChild(this.sourceTypeSelect);

    this.sourcePathInput = document.createElement('input');
    this.sourcePathInput.type = 'text';
    this.sourcePathInput.placeholder =
      'https://github.com/user/repo ou /path/to/folder';
    this.modalBody.appendChild(this.sourcePathInput);

    this.addSourceButton = document.createElement('button');
    this.addSourceButton.textContent = 'Add knowledge';
    this.addSourceButton.disabled = true;
    this.modalBody.appendChild(this.addSourceButton);

    this.sourcePathInput.addEventListener('input', () => {
      this.addSourceButton.disabled = !this.sourcePathInput.value.trim();
    });

    this.modalWindow.appendChild(this.modalBody);
  }

  setSources(sources: Source[]) {
    this.sourcesList.innerHTML = '';

    sources.forEach((src) => {
      const li = document.createElement('li');
      li.textContent = `${src.sourceType} : ${src.sourcePath}`;
      this.sourcesList.appendChild(li);
    });
  }

  onAddSource(callback: (sourceType: string, sourcePath: string) => void) {
    this.addSourceButton.addEventListener('click', () => {
      const sourceType = this.sourceTypeSelect.value;
      const sourcePath = this.sourcePathInput.value.trim();
      callback(sourceType, sourcePath);

      this.sourcePathInput.value = '';
      this.addSourceButton.disabled = true;

      this.hide();
    });
  }

  show() {
    this.modalOverlay.style.display = 'flex';
  }

  hide() {
    this.modalOverlay.style.display = 'none';
  }
}
