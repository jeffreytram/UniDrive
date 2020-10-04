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
    this.setState((prevState) => ({
      showUploadMenu: !prevState.showUploadMenu
    }));
  }
  
  addFiles(target, idToken) {
    const list = [];
    for (let i = 0; i < target.files.length; i++) {
      list[i] = {
        file: target.files[i],
        user: idToken
      };
    }
    this.setState((prevState) => ({
      uploadFiles: [...prevState.uploadFiles, ...list]
    }));
  }
  uploadFiles = () => {
    const { uploadFiles } = this.state;
    const { fileUpload } = this.props;
    for (let i = 0; i < uploadFiles.length; i++) {
      console.log((uploadFiles[i].user));
      fileUpload((uploadFiles[i].user), uploadFiles[i].file);
    }
    this.setState({
      uploadFiles: []
    });
  }

  render() {
    const { showUploadMenu } = this.state;
    const uploadStyles = {
      display: showUploadMenu ? 'flex' : 'none',
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
          Uploader
        </button>
          <div className="menu" style={uploadStyles}>
            {userList.map((user) => (
              <div>
                <input 
                  type="file" 
                  className="button selectFile" 
                  onChange={(e) => this.addFiles(e.target, user.idToken)}
                  multiple/>
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