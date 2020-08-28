import React, { Component } from 'react'
import User from './User'
import { config } from '../config';

var SCOPE = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key
const CLIENT_ID = config.web.client_id

let userId = 1

class App extends Component {
  constructor() {
    super();
    this.state = {
      userList: []
    }
  }

  componentDidMount() {
    var script = document.createElement('script');
    script.onload = this.handleClientLoad;
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);
  }

  handleClientLoad = () => {
    window.gapi.load('client:auth2', this.initClient);
  }

  initClient = () => {
    try {
      window.gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': [discoveryUrl]
      }).then(() => {
        //this.state.googleAuth.isSignedIn.listen(this.updateSigninStatus);
        document.getElementById('signin-btn').addEventListener('click', this.signInFunction);
        document.getElementById('signout-btn').addEventListener('click', this.signOutFunction);

      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Handles user sign in
   */
  signInFunction = () => {
    window.gapi.auth2.getAuthInstance().signIn()
    this.addUser()
    const newUserIndex = this.state.userList.length - 1
    this.updateFiles(newUserIndex, this.state.userList[newUserIndex].drive.files)
    this.addUserInfo(newUserIndex, this.state.userList[newUserIndex].googleAuth.currentUser.get().rt)
    
  }

  /**
   * TODO: Handles user sign out.
   */
  signOutFunction = () => {
    this.state.googleAuth.signOut();
    this.updateSigninStatus();
  }

  updateSigninStatus = () => {
    this.setSigninStatus();
  }

  /**
   * Adds a user to the userList
   */
  addUser = () => {
    this.setState(prevState => {
      return {
        userList: [...prevState.userList, { id: userId++, drive: window.gapi.client.drive, googleAuth: window.gapi.auth2.getAuthInstance(), files: [], info: {} }]
      }
    })
  }

  /**
   * Gets the files and stores them for the user at the given index
   * @param {Number} index index of the user in the userList to update
   * @param {Object} files the file object to store
   */
  updateFiles = (index, files) => {
    files.list({
      fields: 'files(id, name, mimeType, starred, iconLink, shared)'
    })
      .then(response => {
        this.setState(prevState => {
          let newUserList = prevState.userList
          newUserList[index].files = response.result.files
          return {
            userList: newUserList
          }
        })
      },
        function (err) { console.error("Execute error", err); });
  }

  /**
   * Stores the users info for the user at the given index
   * @param {Number} index index of the user in the userList to add the info
   * @param {Object} info info object to store
   */
  addUserInfo = (index, info) => {
    this.setState(prevState => {
      let newUserList = prevState.userList
      newUserList[index].info = info
      return {
        userList: newUserList
      }
    })
  }

  render() {
    return (
      <div className="App">
        <div>UserName: <strong>{this.state.name}</strong></div>
        <button id="signin-btn">Sign In</button>
        <button id="signout-btn">Sign Out</button>
        {this.state.userList.map(user => {
          return (
            <User
              name={user.info.Ad}
              fileList={user.files}
            />
          )
        })}
      </div>
    );
  }
}

export default App;