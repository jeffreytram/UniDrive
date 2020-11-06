import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen, faArrowRight, faPencilAlt, faShare, faCopy, faTrash, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import {
  ContextMenu, MenuItem, ContextMenuTrigger,
} from 'react-contextmenu';
import '../css/File.css';

class File extends Component {
  constructor() {
    super();
    this.state = {};
  }

  copy = () => {
    const { userId } = this.props;
    const fileId = this.props.data.id;
    const refreshFunction = this.props.refreshFunc;
    window.gapi.client.drive.files.copy({
      fileId,
    }).then((response) => {
      refreshFunction(userId);
    });
  }

  delete = (findPermi, findFilePermi, deletePermi) => {
    const { userId } = this.props;
    window.gapi.client.drive.files.update({
      fileId: this.props.data.id,
      trashed: true,
    }).then((response) => {
      const refreshFunction = this.props.refreshFunc;
      refreshFunction(userId);
    }, (error) => {
      console.log(error);
      if (window.confirm("This item is shared with you, and won't be accessible unless shared with you again. Proceed?")) {
        findPermi(findFilePermi, deletePermi);
      }
    });
  }

findPermission = (findFilePermi, deletePermi) => {
  window.gapi.client.drive.about.get({
    fields: '*',
  }).then((response) => {
    console.log(response);
    const permId = response.result.user.permissionId;
    findFilePermi(permId, deletePermi);
  });
}

findFilePermission = (permId, deletePermi) => {
  console.log(permId);
  window.gapi.client.drive.permissions.get({
    fileId: this.props.data.id,
    permissionId: permId,
  }).then((response) => {
    console.log(response);
    deletePermi(response.result.id);
  }, (error) => {
    alert('Error: There is a permission error with this file. Try removing through Google Drive directly');
  });
}

deletePermission = (permId) => {
  const refreshFunction = this.props.refreshFunc;
  const { userId } = this.props;
  window.gapi.client.drive.permissions.delete({
    fileId: this.props.data.id,
    permissionId: permId,
  }).then((response) => {
    refreshFunction(userId);
  });
}

  rename = () => {
    const fileId = this.props.data.id;
    const { userId } = this.props;
    const refreshFunction = this.props.refreshFunc;
    const newName = prompt('Enter New File Name');
    window.gapi.client.drive.files.update({
      fileId,
      resource: { name: newName },
    }).then((response) => {
      refreshFunction(userId);
    }, (error) => {
      console.log(error);
      alert("Can't Rename: User has Invalid Permsission. Either request write access from owner or add owner's account to UniDrive");
    });
  }

  star = () => {
    const refreshFunction = this.props.refreshFunc;
    const { userId } = this.props;
    window.gapi.client.drive.files.update({
      fileId: this.props.data.id,
      starred: !this.props.data.starred,
    }).then((response) => {
      refreshFunction(userId);
    });
  }

  
  // export default function File(props) {
  render() {
    const {
      data, displayed, loadAuth, moveWithin, oId, openFolder, shareFile, userId,
    } = this.props;

    const {
      id, webViewLink, iconLink, name, mimeType, starred,
    } = data;
    const copyFunc = loadAuth(userId, this.copy);
    const deleteFunc = loadAuth(userId, this.delete);
    const renameFunc = loadAuth(userId, this.rename);
    const starFunc = loadAuth(userId, this.star);
    const findPermissionFunc = loadAuth(userId, this.findPermission);
    const findFilePermissionFunc = loadAuth(userId, this.findFilePermission);
    const deletePermissionFunc = loadAuth(userId, this.deletePermission);
    if (displayed) {
      if (mimeType !== 'application/vnd.google-apps.folder') {
      // if file
        return (
          <div>
            <ContextMenuTrigger id={id + userId.toString()}>
              <a href={webViewLink} target="blank">
                <div className="file-container">
                  <div className="file-image-container">
                    <img className="file-img" src={iconLink} alt="File icon" />
                  </div>
                  <div className="file-name">
                    {name}
                  </div>
                </div>
              </a>
            </ContextMenuTrigger>
            <ContextMenu className="context-menu" id={id + userId.toString()}>
              <MenuItem className="menu-item" onClick={() => window.open(webViewLink, 'blank')}>
                <FontAwesomeIcon className="menu-icon" icon={faFolderOpen} />
                Open
              </MenuItem>
              <hr className="divider" />
              <MenuItem className="menu-item" onClick={() => shareFile(id, window.prompt('Email Address of sharee: '))}>
                <FontAwesomeIcon className="faShare menu-icon" icon={faShare} />
                Share
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => moveWithin(userId, data, 'root')}>
                <FontAwesomeIcon className="faArrowRight menu-icon" icon={faArrowRight} />
                Move to Root
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => renameFunc()}>
                <FontAwesomeIcon className="faPencil menu-icon" icon={faPencilAlt} />
                Rename
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => copyFunc()}>
                <FontAwesomeIcon className="faCopy menu-icon" icon={faCopy} />
                Make a copy
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => starFunc()}>
                <FontAwesomeIcon className="faStar menu-icon" icon={faStar} />
                { (starred) ? 'Remove From Starred' : 'Add to Starred' }
              </MenuItem>
              <hr className="divider" />
              <MenuItem className="menu-item" onClick={() => { if (window.confirm('This item will be placed in the trash. Proceed?')) { deleteFunc(findPermissionFunc, findFilePermissionFunc, deletePermissionFunc); } }}>
                <FontAwesomeIcon className="menu-icon" icon={faTrash} />
                Delete
              </MenuItem>
            </ContextMenu>
          </div>
        );
      }
      // if folder
      return (
        <div>
          <ContextMenuTrigger id={id + userId.toString()}>
            <div className="folder-container" onClick={() => openFolder(userId, oId, data)}>
              <div className="folder-content-container">
                <img className="folder-img" src={iconLink} alt="File icon" />
                <p className="folder-name">{name}</p>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenu className="context-menu" id={id + userId.toString()}>
            <MenuItem className="menu-item" onClick={() => window.open(webViewLink, 'blank')}>
              <FontAwesomeIcon className="menu-icon" icon={faGoogleDrive} />
              View on Google Drive
            </MenuItem>
            <hr className="divider" />
            <MenuItem className="menu-item" onClick={() => shareFile(id, window.prompt('Email Address of sharee: '))}>
              <FontAwesomeIcon className="menu-icon" icon={faShare} />
              Share
            </MenuItem>
            <MenuItem className="menu-item" onClick={() => moveWithin(userId, data, 'root')}>
              <FontAwesomeIcon className="menu-icon" icon={faArrowRight} />
              Move to Root
            </MenuItem>
            <MenuItem className="menu-item" onClick={() => renameFunc(userId, id)}>
              <FontAwesomeIcon className="menu-icon" icon={faPencilAlt} />
              Rename
            </MenuItem>
            <MenuItem className="menu-item" onClick={() => starFunc()}>
              <FontAwesomeIcon className="menu-icon" icon={faStar} />
              { (starred) ? 'Remove From Starred' : 'Add to Starred' }
            </MenuItem>
            <hr className="divider" />
            <MenuItem className="menu-item" onClick={() => { if (window.confirm('This item will become unrecoverable. Proceed?')) { deleteFunc(findPermissionFunc, findFilePermissionFunc, deletePermissionFunc); } }}>
              <FontAwesomeIcon className="menu-icon" icon={faTrash} />
              Delete
            </MenuItem>
          </ContextMenu>
        </div>
      );
    } return null;
  }
}

File.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])).isRequired,
  displayed: PropTypes.bool.isRequired,
  loadAuth: PropTypes.func.isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  oId: PropTypes.number,
  openFolder: PropTypes.func,
  refreshFunc: PropTypes.func,
  shareFile: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

File.defaultProps = {
  oId: -1,
  openFolder: () => { console.log('No open folder function found.'); },
  refreshFunc: () => { console.log('No open refresh function found.'); },
};

export default File;
