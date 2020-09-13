import React, { Component } from 'react';
import User from './User';
import Header from './Header';
import { config } from '../config';

const SCOPE = 'profile email openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
const discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key;
const CLIENT_ID = config.web.client_id;
let ready = false;
let userId = 1;

class App extends Component {
  constructor() {
    super();
    this.state = {
      userList: [],
    };
    this.handleClientLoad = this.handleClientLoad.bind(this);
    this.initClient = this.authorizeUser.bind(this);
    this.signInFunction = this.signInFunction.bind(this);
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.onload = this.handleClientLoad;
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
  }

  handleClientLoad() {
    window.gapi.load('client:auth');
  }



   /**
   * Signs a new user into Google, and then begins the process of storing all of their information
   * Returns an idToken, an AccessToken, and a Code, all unique to the user in a Response object
   */
  authorizeUser() {
        window.gapi.load('client:auth', () => {
          window.gapi.auth2.authorize({
            apiKey : API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPE,
            responseType : 'id_token permission code',
            prompt : 'select_account',
            discoveryDocs : [discoveryUrl, 'https:googleapis.com/discovery/v1/apis/profile/v1/rest']
          }, (response) => {
            if (response.error) {
              console.log(response.error)
              console.log("authorization error")
              return
            }
            let accessToken = response.access_token
            let idToken = response.id_token
            let code = response.code
            this.signInFunction(accessToken, idToken, code);
          })
        } )
  }


  /**
   * Handles user sign in by storing all the information gained from the authrizeUser() function above
   
   * @param {Object} accessToken the accessToken granted to the user by gapi.client.authorize()
   * @param {Object} idToken the accessToken granted to the user by gapi.client.authorize()
    * @param {Object} code the code granted to the user by gapi.client.authorize()
   */
  signInFunction(accessToken, idToken, code) {
    ready = false;
    let userInfo = this.parseIDToken(idToken)
    let email = userInfo.email;
    this.addUser(accessToken, idToken, code);
    const { userList } = this.state;
    const newUserIndex = userList.length - 1;
    this.updateFiles(newUserIndex, accessToken, idToken, email);
  }


  /**
   *  Handles user sign out.
   *  Removes the specified user from the userList array, then updates the State
   * @param {number} id attribute of the specific User tp be removed in the UserList array
   */
  signOutFunction(id) {
    if (ready) {
      if (window.confirm('Are you sure you want to remove this account?')) {
        this.setState((prevState) => {
          const newUserList = prevState.userList.filter((user) => user.id !== id);
          return {
            userList: newUserList,
          };
        });
      }
    }
  }


  /**
   * Adds a new user to the list
   * @param {Object} accessToken the accessToken granted to the user by gapi.client.authorize()
   * @param {Object} idToken the accessToken granted to the user by gapi.client.authorize()
    * @param {Object} code the code granted to the user by gapi.client.authorize()
   */
  addUser(accessToken, idToken, code) { 
    this.setState((prevState) => ({
      userList: [...prevState.userList, {
        id: userId,
        accessToken: accessToken,
        idToken: idToken,
        code : code,
        files: [],
      }],
    }));
    userId += 1;
    console.log(this.state.userList)
  }


  /**
   * Gets the files and stores them for the user at the given index
   * @param {Number} index index of the user in the userList to update
   * @param {Object} files the file object to store
   */
  updateFiles(index, accessToken, idToken, email) {
     window.gapi.client.load('drive', 'v3').then(() =>  {
      console.log(window.gapi.client)
      window.gapi.auth2.authorize({
        apiKey : API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        prompt : 'none',
        login_hint : email,
        discoveryDocs : [discoveryUrl]
      }, (response) => {
        if (response.error) {
          console.log(response.error)
          console.log("authorization error")
          return
        }
      window.gapi.client.drive.files.list({
        fields: 'files(id, name, mimeType, starred, iconLink, shared)',
      }).then((response) => {
        console.log(response)
          this.setState((prevState) => {
            const newUserList = prevState.userList;
            newUserList[index].files = response.result.files;
            ready = true;
            return {
              userList: newUserList,
            };
          });
        },
        (err) => { console.error('Execute error', err); });
      });
    });
    }


  /**
   * Decrypts the JSON string idToken in order to access the encrytped user information held within
   * @param {Object} token the idToken of the user
   */
  parseIDToken(token) {
      try {
      return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
   }


  /**
   * Refreshes all the files being displayed within an account
   * @param {Number} id the unique id granted to the user when placed within the userList
   */
  refreshFunction(id) {
    let index = -1;
    for (let i = 0; i < this.state.userList.length; i++) {
      if (this.state.userList[i].id === id) {
        index  = i;
        break;
      }
    }
    let idToken = this.state.userList[index].idToken
    let accessToken = this.state.userList[index].accessToken
    let userInfo = this.parseIDToken(this.state.userList[index].idToken)
    let email = userInfo.email;
    this.updateFiles(index, accessToken, idToken, email)
    console.log('refreshed account: ' + email)
  }

   /**
   * Refreshes all of the accounts currently within the userList
   */
  refreshAllFunction() {
  for(let i = 0; i < this.state.userList.length; i++) {
    let idToken = this.state.userList[i].idToken;
    let accessToken = this.state.userList[i].accessToken;
    let userInfo = this.parseIDToken(this.state.userList[i].idToken);
    let email = userInfo.email;
    this.updateFiles(i, accessToken, idToken, email);
  }
  console.log('refreshed all accounts');
  }



  render() {
    const { userList } = this.state;
    return (
      <div className="App">
        <Header />
        <span>
        <button type="button" id="signin-btn" onClick={() => this.authorizeUser()}>Add an Account</button>
        <button type="button" id="refreshAll-btn" onClick={() => this.refreshAllFunction()}>Refresh all Accounts</button>
        </span>
        {userList.map((user) => (
          <User
            infoData={this.parseIDToken(user.idToken)}
            fileList={user.files}
            userId={user.id}
            removeFunc={(id) => this.signOutFunction(id)}
            refreshFunc={(id) => this.refreshFunction(id)}
          />
        ))}
      </div>
    );
  }
}

export default App;
