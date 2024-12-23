import { ChatBuilder } from './builder';

document.addEventListener('DOMContentLoaded', () => {
  new ChatBuilder().withModel().withView().withController();
});
