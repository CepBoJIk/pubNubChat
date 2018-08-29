const sendRequest = function sendRequest(method, url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.send();

    xhr.onload = function onload() {
      if (xhr.status !== 200) {
        const error = new Error(`${xhr.status}: ${xhr.statusText}`);
        reject(error);
      }
      resolve(xhr);
    };

    xhr.onerror = function onerror() {
      reject(new Error('network error'));
    };
  });
};

class User {
  constructor(name, icon) {
    this.name = name;
    this.icon = icon;
  }
}

export default class Authorization {
  constructor() {
    this.registered = false;
    this.user = null;
  }

  init({
    openRegisterAreaBtn,
    registerArea,
    registerSubmit,
    registerTextInput,
  }) {
    const openBtn = openRegisterAreaBtn;

    openRegisterAreaBtn.addEventListener('click', (event) => {
      registerArea.classList.toggle('active');
      if (event.preventDefault) event.preventDefault();
      return false;
    });

    registerSubmit.addEventListener('click', () => {
      const { value } = registerTextInput;
      if (!value) return;

      this.register(value);
      openBtn.textContent = value;
      registerArea.classList.remove('active');
    });
  }

  register(login, img) {
    let image = img || null;
    if (!image) {
      sendRequest('GET', 'https://picsum.photos/100/100/?random')
        .then((result) => {
          image = result.responseURL;
          this.user = new User(login, image);
          this.registered = true;
        });
    }
  }
}

Authorization.authObj = null;

Authorization.getAuth = function getAuthorizationObject() {
  if (Authorization.authObj) return Authorization.authObj;
  Authorization.authObj = new Authorization();
  return Authorization.authObj;
};
