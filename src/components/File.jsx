import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen, faArrowRight, faPencilAlt, faCopy, faFileDownload, faTrash,
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

  /* Props contains: Name, Link, Image */
  // export default function File(props) {
  render() {
    const {
      userId, data, copyFunc, deleteFunc, renameFunc, displayed, openChildrenFunc, fileObj, moveExternal, shareFile, moveWithin,
    } = this.props;
    const {
      id, webViewLink, iconLink, name, mimeType,
    } = data;
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
              <MenuItem className="menu-item move-to">
                <SubMenu
                  className="context-menu sub-menu-move-to"
                  title={
                    (
                      <span>
                        <FontAwesomeIcon className="menu-icon" icon={faArrowRight} />
                        Move to...
                      </span>
                    )
                  }
                >
                  <MenuItem className="menu-item">
                    Account 1
                  </MenuItem>
                  <MenuItem className="menu-item">
                    Account 2
                  </MenuItem>
                  <MenuItem className="menu-item">
                    Account 3
                  </MenuItem>
                </SubMenu>
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => renameFunc(userId, id)}>
                <FontAwesomeIcon className="menu-icon" icon={faPencilAlt} />
                Rename
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => shareFile(userId, id, window.prompt("Email Address of sharee: "))}>
                Share
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => copyFunc(userId, id)}>
                <FontAwesomeIcon className="menu-icon" icon={faCopy} />
                Make a copy
              </MenuItem>
              <MenuItem className="menu-item">
                <FontAwesomeIcon className="menu-icon" icon={faFileDownload} />
                Download
              </MenuItem>
              <hr className="divider" />
              <MenuItem className="menu-item" onClick={() => { if (window.confirm('This item will be placed in the trash. Proceed?')) { deleteFunc(userId, id); } }}>
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
            <div className="file-container" onClick={() => openChildrenFunc(userId, fileObj, fileObj.fId)}>
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
            <MenuItem className="menu-item" onClick={() => renameFunc(userId, id)}>
              <FontAwesomeIcon className="menu-icon" icon={faPencilAlt} />
              Rename
            </MenuItem>
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
  copyFunc: PropTypes.func.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  renameFunc: PropTypes.func.isRequired,
  fId: PropTypes.number.isRequired,
  displayed: PropTypes.bool.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  fileObj: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf()])),
};

File.defaultProps = {
  fileObj: {},
};

export default File;
