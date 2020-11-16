import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../css/FilePath.css';
import {
  ContextMenu, MenuItem, ContextMenuTrigger,
} from 'react-contextmenu';
import {
  faFolderOpen, faArrowRight, faPencilAlt, faShare, faCopy, faTrash, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';

class Filepath extends Component {
  constructor() {
    super();
    this.state = {
    };
  }


  delete = (findPermi, findFilePermi, deletePermi) => {
    const { userId } = this.props;
    window.gapi.client.drive.files.update({
      fileId: this.props.folder.id,
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
    fileId: this.props.folder.id,
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
    fileId: this.props.folder.id,
    permissionId: permId,
  }).then((response) => {
    refreshFunction(userId);
  });
}

  rename = () => {
    const fileId = this.props.folder.id;
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
      fileId: this.props.folder.id,
      starred: !this.props.folder.starred,
    }).then((response) => {
      refreshFunction(userId);
    });
  }




  render() {
    const {
      folder, oId, pIndex, updatePath, userId, refreshFunc, shareFile, moveWithin, loadAuth
    } = this.props;

    const deleteFunc = loadAuth(userId, this.delete);
    const renameFunc = loadAuth(userId, this.rename);
    const starFunc = loadAuth(userId, this.star);
    const findPermissionFunc = loadAuth(userId, this.findPermission);
    const findFilePermissionFunc = loadAuth(userId, this.findFilePermission);
    const deletePermissionFunc = loadAuth(userId, this.deletePermission);
    return (
      <span className="file-path">
        <span>
          {' '}
          <FontAwesomeIcon icon={faChevronRight} />
          <ContextMenuTrigger id={folder.id + userId.toString() + oId.toString()}>
          <button type="button" className="path-btn" onClick={() => updatePath(userId, oId, pIndex)}>{folder.name}</button>
            </ContextMenuTrigger>
            <ContextMenu className="context-menu" id={folder.id + userId.toString() + oId.toString()}>
            <MenuItem className="menu-item" onClick={() => window.open(folder.webViewLink, 'blank')}>
              <FontAwesomeIcon className="faGoogle menu-icon" icon={faGoogleDrive} />
              View on Google Drive
            </MenuItem>
              <hr className="divider" />
              <MenuItem className="menu-item" onClick={() => shareFile(folder.id, window.prompt('Email Address of sharee: '))}>
                <FontAwesomeIcon className="faShare menu-icon" icon={faShare} />
                Share
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => moveWithin(userId, folder, 'root')}>
                <FontAwesomeIcon className="faArrowRight menu-icon" icon={faArrowRight} />
                Move to Root
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => renameFunc()}>
                <FontAwesomeIcon className="faPencil menu-icon" icon={faPencilAlt} />
                Rename
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => starFunc()}>
                <FontAwesomeIcon className="faStar menu-icon" icon={faStar} />
                { (folder.starred) ? 'Remove From Starred' : 'Add to Starred' }
              </MenuItem>
              <hr className="divider" />
              <MenuItem className="menu-item" onClick={() => { if (window.confirm('This item and all its contents will be placed in the trash. Proceed?')) { deleteFunc(findPermissionFunc, findFilePermissionFunc, deletePermissionFunc); } }}>
                <FontAwesomeIcon className="menu-icon" icon={faTrash} />
                Delete
              </MenuItem>
            </ContextMenu>
        </span>
      </span>
    );
  }
}

Filepath.propTypes = {
  folder: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])).isRequired,
  oId: PropTypes.number.isRequired,
  pIndex: PropTypes.number.isRequired,
  updatePath: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default Filepath;
