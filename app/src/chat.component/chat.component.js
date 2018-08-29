import PubNub from 'pubnub';
import Authorization from '../authorization.component/authorization.component';

class Message {
  constructor(message, user) {
    this.user = user;
    this.message = message;
  }
}

export default class Chat {
  constructor(messageContainer) {
    this.container = messageContainer;
    this.authorization = Authorization.getAuth();
    this.textarea = null;
    this.pubnub = new PubNub({
      publishKey: 'pub-c-ff951516-7673-42ce-a8b8-54593c4d6eda',
      subscribeKey: 'sub-c-e5009a54-a9e7-11e8-8c35-a6946b4e582d',
    });
  }

  init({ textElem, submitBtn, errorElem }) {
    this.textarea = textElem;
    const error = errorElem;

    submitBtn.addEventListener('click', (event) => {
      const message = this.textarea.value;
      if (!message) return event.preventDefault ? event.preventDefault() : false;

      const canPublish = this.publish(message);
      if (!canPublish) {
        error.style.display = 'block';
      } else {
        error.style.display = 'none';
        this.textarea.value = '';
      }

      if (event.preventDefault) event.preventDefault();
      return false;
    });
  }

  subscribe(messageTemplate) {
    const self = this;

    this.pubnub.addListener({
      message(message) {
        self.generateMessage(messageTemplate, message);
      },
    });

    this.pubnub.subscribe({
      channels: ['all'],
    });
  }

  publish(message) {
    if (!this.authorization.registered) return false;

    const newMessage = new Message(message, this.authorization.user);
    this.pubnub.publish({
      message: newMessage,
      channel: 'all',
    });

    return true;
  }

  generateMessage(messageTemplate, message) {
    const messageObj = message.message;
    if (!messageObj.user) throw new Error('сообщение без регистрации');
    const template = messageTemplate.content.cloneNode(true);
    const userIcon = template.querySelector('.message__user-icon-item');
    const userName = template.querySelector('.message__user-name');
    const messageText = template.querySelector('.message__text');

    userIcon.setAttribute('src', messageObj.user.icon);
    userName.textContent = messageObj.user.name;
    messageText.textContent = messageObj.message;

    this.container.appendChild(template);
    if (this.container.scrollHeight > this.container.clientHeight) {
      this.container.scrollTop = this.container.scrollHeight - this.container.clientHeight;
    }
  }
}
