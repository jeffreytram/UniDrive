import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash, faSyncAlt, faEye, faEyeSlash, faUpload, faPlus, faEllipsisV, faFolderPlus, faSortNumericDown, faCheck
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
      openChildrenFunc, looseFileList, openFolderList, buildChildrenArray, filepathTraceFunc, closeFolderFunc, fileUpload, createFunc, sortFunc, currentSort
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
            <FontAwesomeIcon className="fa-ellipsis menu-icon" icon={faEllipsisV} size="lg" onClick={(event) => this.handleIconClick(event, () => {})} title="Options" />
          </ContextMenuTrigger>
        </button>
        <ContextMenu className="context-menu" id={userId}>
          <MenuItem className="menu-item upload">
            <SubMenu
              className="context-menu sub-menu-upload"
              title={
              (
                <span>
                  <FontAwesomeIcon className="fa-plus menu-icon" icon={faPlus} onClick={(event) => this.handleIconClick(event, () => {})} />
                  Create New...
                </span>
              )
            }
            >
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.folder', 'New Folder')}>
                <FontAwesomeIcon className="fa-folder menu-icon" icon={faFolderPlus} />
                Folder
              </MenuItem>
              <hr className="divider" />
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.document', 'New Doc')}>
                <img className="menu-icon" src="https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document" alt="Google Doc icon" />
                Google Doc
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.spreadsheet', 'New Sheet')}>
                <img className="menu-icon" src="https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet" alt="Google Speardsheet icon" />
                Google Sheets
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.presentation', 'New Presentation')}>
                <img className="menu-icon" src="https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.presentation" alt="Google Slides icon" />
                Google Slides
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => createFunc(userId, 'application/vnd.google-apps.form', 'New Form')}>
                <img className="menu-icon" src="https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.form" alt="Google Forms icon" />
                Google Forms
              </MenuItem>
            </SubMenu>
          </MenuItem>
          <label htmlFor={email}>
            <MenuItem className="menu-item">
              <FontAwesomeIcon className="fa-upload menu-icon" icon={faUpload} />
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
            <FontAwesomeIcon className="fa-eye-slash menu-icon" icon={(looseFilesIsDisplayed) ? faEye : faEyeSlash} />
            Toggle Folder View
          </MenuItem>


          <MenuItem className="menu-item sort">
            <SubMenu
              className="context-menu sub-menu-sort"
              title={
              (
                <span>
                  <FontAwesomeIcon className="fa-sort menu-icon" icon={faSortNumericDown} onClick={(event) => this.handleIconClick(event, () => {})} />
                  Sort...
                </span>
              )
            }
            >
              <MenuItem className="menu-item" onClick={() => sortFunc(userId, 'folder, viewedByMeTime desc')}>
                {"Last Opened by Me"}
                <FontAwesomeIcon className="fa-check menu-icon" icon={currentSort === 'folder, viewedByMeTime desc'? faCheck : null} />
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => sortFunc(userId, 'folder, modifiedTime desc' )}>
                {"Last Modified"}
                <FontAwesomeIcon className="fa-check menu-icon" icon={currentSort === 'folder, modifiedTime desc'? faCheck : null} />
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => sortFunc(userId, 'folder, createdTime desc')}>
                {"Newest"}
                <FontAwesomeIcon className="fa-check menu-icon" icon={currentSort === 'folder, createdTime desc'? faCheck : null} />
              </MenuItem>
              <MenuItem className="menu-item" onClick={() => sortFunc(userId, 'folder, createdTime')}>
                {"Oldest"}
                <FontAwesomeIcon className="fa-check menu-icon" icon={currentSort === 'folder, createdTime'? faCheck : null} />
              </MenuItem>
            </SubMenu>
          </MenuItem>


          <MenuItem className="menu-item" onClick={(event) => this.handleIconClick(event, () => refreshFunc(userId))}>
            <FontAwesomeIcon className="fa-sync menu-icon" icon={faSyncAlt} />
            Refresh Account
          </MenuItem>
          <MenuItem className="menu-item" onClick={(event) => this.handleIconClick(event, () => removeFunc(userId))}>
            <FontAwesomeIcon className="fa-trash menu-icon" icon={faTrash} />
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
