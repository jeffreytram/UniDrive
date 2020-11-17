import { config } from '../../config';

const SCOPE = 'profile email openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
const discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key;
const CLIENT_ID = config.web.client_id;

export const loadAuth = (email, func) => (...args) => {
  window.gapi.client.load('drive', 'v3').then(() => {
    window.gapi.auth2.authorize({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPE,
      prompt: 'none',
      login_hint: email,
      discoveryDocs: [discoveryUrl],
    }, (response) => {
      if (response.error) {
        console.log(response.error);
      }
      func.call(this, ...args);
    });
  });
};

export const name = 'hi';
