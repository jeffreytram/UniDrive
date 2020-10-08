import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSyncAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import LooseFileList from './LooseFileList';
import TopLevelFolderList from './TopLevelFolderList';
import OpenFolderList from './OpenFolderList';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import './User.css';


class User extends Component {
  constructor() {
    super();
    this.state = {
      isDisplayed: false,
    };
  }

  viewToggle = () => {
    this.setState((prevState) => ({
      isDisplayed: !prevState.isDisplayed
    }));
  }

  handleIconClick = (event, func) => {
    event.stopPropagation();
    func();
  }

  render() {
    const { isDisplayed } = this.state;
    const {
      infoData, parseIDToken, removeFunc, userId, fileList, refreshFunc, copyFunc, deleteFunc, isChildFunc, topLevelFolderList,
      openChildrenFunc, looseFileList, openFolderList, buildChildrenArray, filepathTraceFunc, closeFolderFunc, createFunc
    } = this.props;

    const parsedInfo = parseIDToken(infoData);
    const { name, email, picture } = parsedInfo;
    const fileContainerStyles = {
      display: isDisplayed ? 'flex' : 'none',
    };

    return (
      <div className="user">
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
  
          <FontAwesomeIcon className="fa-trash" icon={faTrash} size="lg" onClick={(event) => this.handleIconClick(event, () => removeFunc(userId))} />
          <FontAwesomeIcon className="fa-sync" icon={faSyncAlt} size="lg" onClick={(event) => this.handleIconClick(event, () => refreshFunc(userId))} />
        
          <ContextMenuTrigger className="context-menu" id={userId} holdToDisplay={0}>
          <FontAwesomeIcon className="fa-plus" icon={faPlus} size="lg"  onClick={(event) => this.handleIconClick(event, () => {})}/>
           </ContextMenuTrigger>

        </button>
        <ContextMenu className="context-menu" id = {userId}>
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
             
            </ContextMenu>


    
      
        {' '}

        <TopLevelFolderList
          fileList={fileList}
          fileContainerStyles={fileContainerStyles}
          userId={userId}
          copyFunc={copyFunc}
          deleteFunc={deleteFunc}
          topLevelFolderList={topLevelFolderList}
          openChildrenFunc={openChildrenFunc}
        />

        <OpenFolderList
          fileList={fileList}
          fileContainerStyles={fileContainerStyles}
          userId={userId}
          copyFunc={copyFunc}
          deleteFunc={deleteFunc}
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
          openChildrenFunc={openChildrenFunc}
          looseFileList={looseFileList}
        />

      </div>
    );
  }
}

User.propTypes = {
  infoData: PropTypes.string.isRequired,
  parseIDToken: PropTypes.func.isRequired,
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.number.isRequired,
  removeFunc: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  copyFunc: PropTypes.func.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  openFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
  createFunc: PropTypes.func.isRequired
};

export default User;
