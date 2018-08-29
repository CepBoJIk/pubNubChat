import '../style.css';
import Chat from './src/chat.component/chat.component';
import './src/chat.component/chat.component.scss';
import Authorization from './src/authorization.component/authorization.component';

const chat = new Chat(document.querySelector('.chat__viewport'));
chat.init({
  textElem: document.querySelector('.chat__input'),
  submitBtn: document.querySelector('.chat__button'),
  errorElem: document.querySelector('.register-error'),
});
chat.subscribe(document.querySelector('.template-message'));

const authorization = Authorization.getAuth();
authorization.init({
  openRegisterAreaBtn: document.querySelector('.chat__register'),
  registerArea: document.querySelector('.register'),
  registerSubmit: document.querySelector('.register__button'),
  registerTextInput: document.querySelector('.register__input'),
});
