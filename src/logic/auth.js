import { config } from '../config';

const SCOPE = 'profile email openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
const discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key;
const CLIENT_ID = config.web.client_id;

/**
 * Decrypts the JSON string idToken in order to access the encrytped user information held within
 * @param {Object} token the idToken of the user
 */
export const parseIDToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * Signs a new user into Google, and then begins the process of storing all of their information
 * Returns an idToken, an AccessToken, and a Code, all unique to the user in a Response object
 */
export const authorizeUserHelper = (email, func) => {
  const prompt = (email) ? 'none' : 'select_account';
  const loginHint = (email) || 'none';
  window.gapi.load('client:auth', () => {
    window.gapi.auth2.authorize({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPE,
      responseType: 'id_token permission code',
      prompt,
      login_hint: loginHint,
      discoveryDocs: [discoveryUrl, 'https:googleapis.com/discovery/v1/apis/profile/v1/rest'],
    }, (response) => {
      if (response.error) {
        console.log(response.error);
        console.log('authorization error');
        return;
      }
      const accessToken = response.access_token;
      const idToken = response.id_token;
      const { code } = response;
      func(accessToken, idToken, code);
    });
  });
};

export const loadAuth = (email, func) => {
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
      func();
    });
  });
};

export const loadAuthParam = (email, func) => (...args) => {
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
