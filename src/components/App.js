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

  signInFunction = () => {
    window.gapi.auth2.getAuthInstance().signIn()
    this.addUser()
    const newUserIndex = this.state.userList.length - 1
    this.updateFiles(newUserIndex, this.state.userList[newUserIndex].drive.files)
    this.addUserInfo(newUserIndex, this.state.userList[newUserIndex].googleAuth.currentUser.get().rt)
    
  }

  //TODO: need to remove user from userlist when signing out
  signOutFunction = () => {
    this.state.googleAuth.signOut();
    this.updateSigninStatus();
  }

  updateSigninStatus = () => {
    this.setSigninStatus();
  }

  //sets the sign in display name - TODO: delete
  setSigninStatus = async () => {
    var user = this.state.googleAuth.currentUser.get();
    console.log(user)
    if (user.wc == null) {
      this.setState({
        name: ''
      });
    }
    else {
      var isAuthorized = user.hasGrantedScopes(SCOPE);
      if (isAuthorized) {
        this.setState({
          name: user.rt.Ad
        });
      }
    }
  }

  addUser = () => {
    this.setState(prevState => {
      return {
        userList: [...prevState.userList, { id: userId++, drive: window.gapi.client.drive, googleAuth: window.gapi.auth2.getAuthInstance(), files: [], info: {} }]
      }
    })
  }

  //gets the files and stores them for user at given index
  updateFiles = (index, files) => {
    // check if right user
    files.list({
      fields: 'files(id, name, mimeType, starred, iconLink, shared)'
    })
      .then(response => {
        // Handle the results here (response.result has the parsed body).
        // update that user's files
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