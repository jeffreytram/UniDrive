import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen, faArrowRight, faPencilAlt, faShare, faCopy, faTrash, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import {
  ContextMenu, MenuItem, ContextMenuTrigger, SubMenu,
} from 'react-contextmenu';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import './File.css';

class File extends Component {
  constructor() {
    super();
    this.state = {};
  }

  copy = () => {
    const { userId } = this.props;
    const fileId = this.props.data.id;
    const refreshFunction = this.props.refreshFunc;
    return window.gapi.client.drive.files.copy({
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
    console.log(permId);
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
    console.log('rename')
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

  star = () => window.gapi.client.drive.files.update({
    fileId: this.props.data.id,
    starred: !this.props.data.starred,
  })


initShare = (share, shareInternal, shareExternal, findPermi, findFilePermi, deletePermi) => {
  console.log('initshare')
  console.log(share)
    const fileId = this.props.data.id;
    const { userId } = this.props;
    const primaryUser = this.props.primaryAccount;
    const email = this.props.email;
    let isIncluded = false;
    console.log(primaryUser)
    for (let i = 0; i< primaryUser.files.length; i++) {
      if (primaryUser.files[i].id === fileId) {
        isIncluded = true;
        break;
      }
    }
    console.log(isIncluded)
    if (isIncluded) {
      share()
  } else {
    shareInternal(shareExternal, findPermi, findFilePermi, deletePermi)
  }
}

  share = () => {

    const fileId = this.props.data.id;
    const { userId } = this.props;
    const primaryUser = this.props.primaryAccount;
      let s = new window.gapi.drive.share.ShareClient()
      console.log(s)
      s.setOAuthToken(primaryUser.accessToken)
      s.setItemIds(fileId);
      s.showSettingsDialog()
    }
 

  shareInternal = (shareExternal, findPermi, findFilePermi, deletePermi) => {
    const fileId = this.props.data.id;
    const primaryUser = this.props.primaryAccount;
    window.gapi.client.drive.permissions.create({
      fileId,
      sendNotificationEmail: false,
      resource: {
        type: 'user',
        role: 'writer',
        emailAddress: primaryUser.email,
      },
    }).then((response) => {
      shareExternal(findPermi, findFilePermi, deletePermi);
    }, (error) => {
      alert('Error with internal share');
    });
  }



   shareExternal = (findPermi, findFilePermi, deletePermi) => {
    const fileId = this.props.data.id;
    const { userId } = this.props;
    const primaryUser = this.props.primaryAccount;
    let s = new window.gapi.drive.share.ShareClient()
    console.log(s)
    s.setOAuthToken(primaryUser.accessToken)
    s.setItemIds(fileId);
    s.showSettingsDialog()
    refreshAll = this.props.refreshAllFunc;
    //if Yes is selected to share with primary
    if (findPermi === undefined) {
      refreshAll();
      return;
    }
    
     //3 minute timer until file gets "unshared" with primary, so that user has enough time to actually share first. 
     //Refresh will occur here also to update accounts
     //note if UniDrive is closed in this window the file won't be unshared with primary
    setTimeout(function () {
      findPermi(findFilePermi, deletePermi)
  }, 180000)
  }





    
   submit = (share, shareInternal, shareExternal, findPermi, findFilePermi, deletePermi) => {
     console.log('submit')
    const primaryUser = this.props.primaryAccount;
    if (primaryUser.email === this.props.email) {
      this.initShare(share, shareInternal, shareExternal)
    } else {
    confirmAlert({
      title: 'Are you trying to share with ' + primaryUser.email + "?",
      message: 'To accomplish sharing, this file must be briefly shared with '  + primaryUser.email + ', and then will be unshared once complete. Select yes if ' + primaryUser.email + ' is an intended recipient of the share.',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>  this.initShare(share, shareInternal, shareExternal)
        },
        {
          label: 'No',
          onClick: () => this.initShare(share, shareInternal, shareExternal, findPermi, findFilePermi, deletePermi)
        }
      ]
    });
  }
  };

  

  /* Props contains: Name, Link, Image */
  // export default function File(props) {
  render() {
    const {
      userId, data, fId, displayed, openChildrenFunc, fileObj, moveExternal, shareFile, moveWithin,
      loadAuth, refreshFunc, email, primaryAccount, refreshAllFunc
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
    const findPermissionFunc1 = loadAuth(userId, this.findPermission, primaryAccount, true);
    const findFilePermissionFunc1 = loadAuth(userId, this.findFilePermission, primaryAccount, true);
    const deletePermissionFunc1 = loadAuth(userId, this.deletePermission, primaryAccount, true);
    const shareFunc = loadAuth(1, this.share, primaryAccount)
    const shareInternalFunc = loadAuth(userId, this.shareInternal)
    const shareExternalFunc = loadAuth(1, this.shareExternal, primaryAccount)
    if (displayed) {
      if (mimeType !== 'application/vnd.google-apps.folder') {
      // if file
        return (
          <div>
            <ContextMenuTrigger className="file-container" id={id}>
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
            <ContextMenu className="context-menu" id={id}>
              <MenuItem className="menu-item" onClick={() => window.open(webViewLink, 'blank')}>
                <FontAwesomeIcon className="menu-icon" icon={faFolderOpen} />
                Open
              </MenuItem>
              <hr className="divider" />
              <MenuItem className="menu-item" onClick={() => this.submit(shareFunc, shareInternalFunc, shareExternalFunc, findPermissionFunc1, findFilePermissionFunc1, deletePermissionFunc1 )}>
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
              <MenuItem className="menu-item" onClick={() => copyFunc()}>
                <FontAwesomeIcon className="menu-icon" icon={faCopy} />
                Make a copy
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => starFunc()}>
                <FontAwesomeIcon className="menu-icon" icon={faStar} />
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
          <ContextMenuTrigger className="file-container" id={id}>
            <div className="file-container" onClick={() => openChildrenFunc(userId, fileObj, fId)}>
              <div className="file-image-container">
                <img className="file-img" src={iconLink} alt="File icon" />
              </div>
              <div className="file-name">
                {name}
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenu className="context-menu" id={id}>
            <MenuItem className="menu-item" onClick={() => window.open(webViewLink, 'blank')}>
              <FontAwesomeIcon className="menu-icon" icon={faGoogleDrive} />
              View on Google Drive
            </MenuItem>
            <hr className="divider" />
            <MenuItem className="menu-item" onClick={() => this.submit(share, shareInternal, shareExternal )}>
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
  userId: PropTypes.number.isRequired,
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])).isRequired,
  fId: PropTypes.number.isRequired,
  displayed: PropTypes.bool.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  fileObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf()])),
};

File.defaultProps = {
  fileObj: {},
};

export default File;
