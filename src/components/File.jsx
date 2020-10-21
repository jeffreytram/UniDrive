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
import './File.css';

class File extends Component {
  constructor() {
    super();
    this.state = {};
  }

  copy = () => {
    const fileId = this.props.data.id;
    return window.gapi.client.drive.files.copy({
      fileId,
    });
  }

  delete = () => window.gapi.client.drive.files.update({
    fileId: this.props.data.id,
    trashed: true,
  })

  rename = () => {
    const newName = prompt('Enter New File Name');
    return window.gapi.client.drive.files.update({
      fileId: this.props.data.id,
      resource: { name: newName },
    });
  }

  star = () => window.gapi.client.drive.files.update({
    fileId: this.props.data.id,
    starred: !this.props.data.starred,
  })

  /* Props contains: Name, Link, Image */
  // export default function File(props) {
  render() {
    const {
      userId, data, fId, displayed, openChildrenFunc, fileObj, moveExternal, shareFile, moveWithin,
      loadAuth,
    } = this.props;
    const {
      id, webViewLink, iconLink, name, mimeType, starred,
    } = data;
    const copyFunc = loadAuth(userId, this.copy);
    const deleteFunc = loadAuth(userId, this.delete);
    const renameFunc = loadAuth(userId, this.rename);
    const starFunc = loadAuth(userId, this.star);
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
              <MenuItem className="menu-item" onClick={() => shareFile(id, window.prompt('Email Address of sharee: '))}>
                <FontAwesomeIcon className="menu-icon" icon={faShare} />
                Share
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => moveWithin(userId, data, 'root')}>
                <FontAwesomeIcon className="menu-icon" icon={faArrowRight} />
                Move to Root
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => renameFunc()}>
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
              <MenuItem className="menu-item" onClick={() => { if (window.confirm('This item will be placed in the trash. Proceed?')) { deleteFunc(); } }}>
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
            <MenuItem className="menu-item" onClick={() => { if (window.confirm('This item will become unrecoverable. Proceed?')) { deleteFunc(userId, id); } }}>
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
