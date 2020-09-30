import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Upload.css';

//Next: Include User to Upload in list

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      showUploadMenu: false,
      uploadFiles: []
    }
  }
  toggleUploadMenu = () => {
    console.log("??");
    this.setState((prevState) => ({
      showUploadMenu: !prevState.showUploadMenu
    }));
  }
  
  addFiles(target) {
    const list = [];
    console.log(target.files);
    for (let i = 0; i < target.files.length; i++) {
      list[i] = {
        file: target.files[i],
        user: this.props.parseIDToken(target.id)
      };
    }
    this.setState((prevState) => ({
      uploadFiles: [...prevState.uploadFiles, ...list]
    }));
  }
  uploadFiles = () => {
    for (let i = 0; i < this.state.uploadFiles.length; i++) {
      this.fileUpload((this.state.uploadFiles[i].user), this.state.uploadFiles[i].file);
    }
    this.setState({
      uploadFiles: []
    });
  }

    /**
   * Uploads a file specified
   * @param {*} email User info for getting account
   * @param {*} fileUpl File to be uploaded
   */
  fileUpload = (email, fileUpl) => {
    /* const index = this.getAccountIndex(userId);
    const email = this.parseIDToken(userId); */
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
          console.log("Auth error.");
        }
        const file = fileUpl;
        //new File(['Hello, world!'], 'hello world.txt', { type: 'text/plain;charset=utf-8' });
        const contentType = file.type || 'application/octet-stream';
        const resumable = new XMLHttpRequest();
        resumable.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', true);
        resumable.setRequestHeader('Authorization', 'Bearer ' + response.access_token);
        resumable.setRequestHeader('Content-Type', 'application/json');
        resumable.setRequestHeader('X-Upload-Content-Length', file.size);
        resumable.setRequestHeader('X-Upload-Content-Type', contentType);
        console.log(resumable);
        console.log("remsume");
        resumable.onreadystatechange = function() {
          if(resumable.readyState === XMLHttpRequest.DONE && resumable.status === 200) {
            const locationUrl = resumable.getResponseHeader('Location');
            const reader = new FileReader();
            reader.onload = () => {
              const uploadResumable = new XMLHttpRequest();
              uploadResumable.open('PUT', locationUrl, true);
              uploadResumable.setRequestHeader('Content-Type', contentType);
              uploadResumable.setRequestHeader('X-Upload-Content-Type', contentType);
              uploadResumable.onreadystatechange = function() {
                if(uploadResumable.readyState === XMLHttpRequest.DONE && uploadResumable.status === 200) {
                  console.log(uploadResumable.response);
                }
              };
              uploadResumable.send(reader.result);
              console.log("app");
            };
            reader.readAsArrayBuffer(file);
          }
        };
        resumable.send(JSON.stringify({
          'name': file.name,
          'mimeType': contentType,
          'Content-Type': contentType,
          'Content-Length': file.size
        }));
      });
    });
  }

  render() {
    const uploadStyles = {
      display: this.state.showUploadMenu ? 'flex' : 'none',
    };
    const {userList, parseIDToken} = this.props;
    return (
      <div>
        <button 
          type="button" 
          className="button selectUser"
          id="upload-menu-btn" 
          onClick={() => this.toggleUploadMenu()}
          onKeyDown={() => this.toggleUploadMenu()}>
          Uploado
        </button>
          <div className="menu" style={uploadStyles}>
            {userList.map((user) => (
              <div>
                <div>
                  {parseIDToken(user.id)}
                </div>
                <input 
                  type="file" 
                  className="button selectFile" 
                  id={user.id}
                  onChange={(e) => this.addFiles(e.target)} 
                  multiple/>
                <button type="button" onClick={() => this.toggleUploadMenu()}>Close</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={this.uploadFiles}>Upload</button>
      </div>
    )
  }
}

Upload.propTypes = {
  userList: PropTypes.objectOf([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
  fileUpload: PropTypes.func.isRequired,
  parseIDToken: PropTypes.func.isRequired,
};

export default Upload;