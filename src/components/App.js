import React, { Component } from 'react'
import { config } from '../config';

var SCOPE = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key
const CLIENT_ID = config.web.client_id

class App extends Component {
  state = {
    name: '',
    googleAuth: ''
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
        this.setState({
          googleAuth: window.gapi.auth2.getAuthInstance()
        })
        this.state.googleAuth.isSignedIn.listen(this.updateSigninStatus);
        console.log(window.gapi)
        window.gapi.client.drive.files.list({})
          .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response)
            console.log(response.result.files)
          },
            function (err) { console.error("Execute error", err); });
        document.getElementById('signin-btn').addEventListener('click', this.signInFunction);
        document.getElementById('signout-btn').addEventListener('click', this.signOutFunction);

      });
    } catch (e) {
      console.log(e);
    }
  }

  signInFunction = () => {
    this.state.googleAuth.signIn();
    this.updateSigninStatus()
  }

  signOutFunction = () => {
    this.state.googleAuth.signOut();
    this.updateSigninStatus()
  }

  updateSigninStatus = () => {
    this.setSigninStatus();
  }

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
  render() {
    return (
      <div className="App">
        <div>UserName: <strong>{this.state.name}</strong></div>
        <button id="signin-btn">Sign In</button>
        <button id="signout-btn">Sign Out</button>
      </div>
    );
  }
}

export default App;