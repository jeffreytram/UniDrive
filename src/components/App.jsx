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
let GoogleAuth;
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
   * Handles user sign in
   */
  signInFunction(accessToken, idToken, code) {
    ready = false;
    let userInfo = this.parseIDToken(idToken)
    let email = userInfo.email;
    this.addUser(accessToken, idToken, code);

    const { userList } = this.state;
    const newUserIndex = userList.length - 1;
    this.updateFiles(newUserIndex, accessToken, idToken, email);
    
    this.addUserInfo(newUserIndex, accessToken, idToken);
    //console.log(window.gapi.client)
  }

  /**
   *  Handles user sign out.
   *  Removes the specified user from the userList array, then updates the State
   *
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
   * Adds a user to the userList
   */
  addUser(accessToken, idToken, code) { 
    console.log(window.gapi.client)
    console.log(idToken)
    console.log(this.parseIDToken(idToken))
    
    
    this.setState((prevState) => ({
      userList: [...prevState.userList, {
        id: userId,
        accessToken: accessToken,
        idToken: idToken,
        code : code,
        //drive: window.gapi.client.drive,
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
        //responseType : 'id_token permission code',
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

  parseIDToken(token) {
      try {
        
      return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
   }


  /**
   * Stores the users info for the user at the given index
   * @param {Number} index index of the user in the userList to add the info
   * @param {Object} info info object to store
   */
  addUserInfo(index, accessToken, idToken) {
          this.setState((prevState) => {
            const newUserList = prevState.userList;
            return {
              userList: newUserList
            }
          })
 
  
    }
  

  refreshFunction(id) {
    console.log('refresh')
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

  }

//}

  render() {
    const { userList } = this.state;
    return (
      <div className="App">
        <Header />
        <button type="button" id="signin-btn" onClick={() => this.authorizeUser()}>Add an Account</button>
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
