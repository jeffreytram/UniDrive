import React, { Component } from 'react';
import User from './User';
import Header from './Header';
import { config } from '../config';

const SCOPE = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
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
    this.initClient = this.initClient.bind(this);
    this.signInFunction = this.signInFunction.bind(this);
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.onload = this.handleClientLoad;
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
  }

  handleClientLoad() {
    window.gapi.load('client:auth2', this.initClient);
  }

  initClient() {
    try {
      window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        discoveryDocs: [discoveryUrl],
      }).then(() => {
        GoogleAuth = window.gapi.auth2.getAuthInstance();

        GoogleAuth.attachClickHandler('signin-btn', GoogleAuth.options, this.signInFunction, console.log('startup'));
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Handles user sign in
   */
  signInFunction() {
    ready = false;
    this.addUser();

    const { userList } = this.state;
    const newUserIndex = userList.length - 1;

    this.updateFiles(newUserIndex, userList[newUserIndex].drive.files);
    this.addUserInfo(newUserIndex, userList[newUserIndex].googleAuth.currentUser.get().rt);
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
  addUser() {
    this.setState((prevState) => ({
      userList: [...prevState.userList, {
        id: userId,
        drive: window.gapi.client.drive,
        googleAuth: window.gapi.auth2.getAuthInstance(),
        files: [],
        info: {},
      }],
    }));
    userId += 1;
  }

  /**
   * Gets the files and stores them for the user at the given index
   * @param {Number} index index of the user in the userList to update
   * @param {Object} files the file object to store
   */
  updateFiles(index, files) {
    files.list({
      fields: 'files(id, name, mimeType, starred, iconLink, shared)',
    })
      .then((response) => {
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
  }

  /**
   * Stores the users info for the user at the given index
   * @param {Number} index index of the user in the userList to add the info
   * @param {Object} info info object to store
   */
  addUserInfo(index, info) {
    this.setState((prevState) => {
      const newUserList = prevState.userList;
      newUserList[index].info = info;
      return {
        userList: newUserList,
      };
    });
  }

  render() {
    const { userList } = this.state;
    return (
      <div className="App">
        <Header />
        <button type="button" id="signin-btn">Add an Account</button>
        {userList.map((user) => (
          <User
            name={user.info.Ad}
            infoData={user.info}
            fileList={user.files}
            userId={user.id}
            removeFunc={(id) => this.signOutFunction(id)}
          />
        ))}
      </div>
    );
  }
}

export default App;
