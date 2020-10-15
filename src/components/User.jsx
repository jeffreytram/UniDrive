import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash, faSyncAlt, faEye, faEyeSlash, faUpload, faPlus, faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import {
  ContextMenu, MenuItem, ContextMenuTrigger, SubMenu,
} from 'react-contextmenu';
import LooseFileList from './LooseFileList';
import TopLevelFolderList from './TopLevelFolderList';
import OpenFolderList from './OpenFolderList';
import './User.css';

class User extends Component {
  constructor() {
    super();
    this.state = {
      isDisplayed: false,
      looseFilesIsDisplayed: true,
    };
  }

  viewToggle = () => {
    this.setState((prevState) => ({
      isDisplayed: !prevState.isDisplayed,
    }));
  }

  handleIconClick = (event, func) => {
    event.stopPropagation();
    if (func !== undefined) {
      func();
    }
  }

  uploadController = (event, idToken) => {
    event.stopPropagation();
    const uploadedFiles = this.addFiles(event.target, idToken);
    this.uploadFiles(uploadedFiles);
  }

  addFiles = (target, idToken) => {
    const list = [];
    for (let i = 0; i < target.files.length; i++) {
      list[i] = {
        file: target.files[i],
        user: idToken,
      };
    }
    return list;
  }

  uploadFiles = (filesList) => {
    const { fileUpload } = this.props;
    for (let i = 0; i < filesList.length; i++) {
      fileUpload((filesList[i].user), filesList[i].file);
    }
  }

  toggleLoose = () => {
    this.setState((prevState) => ({
      looseFilesIsDisplayed: !prevState.looseFilesIsDisplayed,
    }));
  }

  render() {
    const { isDisplayed, looseFilesIsDisplayed } = this.state;

    const {
      infoData, parseIDToken, removeFunc, userId, idToken, fileList, refreshFunc, copyFunc, deleteFunc, renameFunc, isChildFunc, topLevelFolderList,
      openChildrenFunc, looseFileList, openFolderList, buildChildrenArray, filepathTraceFunc, closeFolderFunc, fileUpload, createFunc,
    } = this.props;

    const parsedInfo = parseIDToken(infoData);
    const { name, email, picture } = parsedInfo;
    const fileContainerStyles = {
      display: isDisplayed ? 'flex' : 'none',
    };
    return (
      <ContextMenuTrigger className="user" id={userId}>
        <button
          type="button"
          className="user-banner"
          onClick={() => this.viewToggle()}
          onKeyDown={() => this.viewToggle()}
        >
          <img className="profile-picture" src={picture} alt="UniDrive logo" />
          <span className="profile-text">
            <span className="profile-name">{name}</span>
            {' '}
            <span className="profile-email">
              (
              {email}
              )
            </span>
          </span>
          <ContextMenuTrigger className="context-menu" id={userId} holdToDisplay={0}>
            <FontAwesomeIcon className="fa-ellipsis" icon={faEllipsisV} size="lg" onClick={(event) => this.handleIconClick(event, () => {})} title="Options" />
          </ContextMenuTrigger>
        </button>
        <ContextMenu className="context-menu" id={userId}>
          <MenuItem className="menu-item">
            <SubMenu
              className="context-menu"
              title={
              (
                <span>
                  <FontAwesomeIcon className="fa-plus" icon={faPlus} onClick={(event) => this.handleIconClick(event, () => {})} title="Create New Folder/File" />
                  Create New...
                </span>
              )
            }
            >
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.folder', 'New Folder')}>
                New Folder
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.document', 'New Doc')}>
                New Google Doc
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.spreadsheet', 'New Sheet')}>
                New Google Sheets
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.presentation', 'New Presentation')}>
                New Google Slides
              </MenuItem>
            </SubMenu>
          </MenuItem>
          <label htmlFor={email}>
            <MenuItem className="menu-item">
              <FontAwesomeIcon className="fa-upload" icon={faUpload} title="Upload file" />
              <input
                type="file"
                id={email}
                className="file-input"
                onChange={(e) => this.uploadController(e, idToken)}
                multiple
              />
              Upload
            </MenuItem>
          </label>
          <MenuItem className="menu-item" onClick={(event) => this.handleIconClick(event, () => this.toggleLoose())}>
            <FontAwesomeIcon className="fas fa-eye-slash" icon={(looseFilesIsDisplayed) ? faEye : faEyeSlash} title="Toggle folders-only view" />
            Toggle Folder View
          </MenuItem>
          <MenuItem className="menu-item" onClick={(event) => this.handleIconClick(event, () => refreshFunc(userId))}>
            <FontAwesomeIcon className="fa-sync" icon={faSyncAlt} title="Refresh Account" />
            Refresh Account
          </MenuItem>
          <MenuItem className="menu-item" onClick={(event) => this.handleIconClick(event, () => removeFunc(userId))}>
            <FontAwesomeIcon className="fa-trash" icon={faTrash} title="Remove Account" />
            Remove Account
          </MenuItem>
        </ContextMenu>
        <TopLevelFolderList
          fileList={fileList}
          fileContainerStyles={fileContainerStyles}
          userId={userId}
          copyFunc={copyFunc}
          deleteFunc={deleteFunc}
          renameFunc={renameFunc}
          topLevelFolderList={topLevelFolderList}
          openChildrenFunc={openChildrenFunc}
        />

        <OpenFolderList
          fileList={fileList}
          fileContainerStyles={fileContainerStyles}
          userId={userId}
          copyFunc={copyFunc}
          deleteFunc={deleteFunc}
          renameFunc={renameFunc}
          openChildrenFunc={openChildrenFunc}
          filepathTraceFunc={filepathTraceFunc}
          openFolderList={openFolderList}
          buildChildrenArray={buildChildrenArray}
          closeFolderFunc={closeFolderFunc}
        />
        <LooseFileList
          fileList={fileList}
          fileContainerStyles={fileContainerStyles}
          userId={userId}
          copyFunc={copyFunc}
          deleteFunc={deleteFunc}
          renameFunc={renameFunc}
          openChildrenFunc={openChildrenFunc}
          looseFileList={looseFileList}
          isDisplayed={looseFilesIsDisplayed}
        />
      </ContextMenuTrigger>
    );
  }
}

User.propTypes = {
  infoData: PropTypes.string.isRequired,
  parseIDToken: PropTypes.func.isRequired,
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.number.isRequired,
  idToken: PropTypes.string.isRequired,
  removeFunc: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  fileUpload: PropTypes.func.isRequired,
  copyFunc: PropTypes.func.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  renameFunc: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  openFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
  createFunc: PropTypes.func.isRequired,
};

export default User;
