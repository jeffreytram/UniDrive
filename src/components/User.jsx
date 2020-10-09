import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSyncAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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
    func();
  }

  toggleLoose = () => {
    this.setState((prevState) => ({  
      looseFilesIsDisplayed: !prevState.looseFilesIsDisplayed
    }))
  }

  render() {
    const { isDisplayed, looseFilesIsDisplayed } = this.state;

    const {
      infoData, parseIDToken, removeFunc, userId, fileList, refreshFunc, copyFunc, deleteFunc, isChildFunc, topLevelFolderList,
      openChildrenFunc, looseFileList, openFolderList, buildChildrenArray, filepathTraceFunc, closeFolderFunc,
    } = this.props;

    const parsedInfo = parseIDToken(infoData);
    const { name, email, picture } = parsedInfo;
    const fileContainerStyles = {
      display: isDisplayed ? 'flex' : 'none',
    };
    if (looseFilesIsDisplayed) {
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
          <FontAwesomeIcon className="fa-trash" icon={faTrash} size="lg" onClick={(event) => this.handleIconClick(event, () => removeFunc(userId))} title="Remove Account" />
          <FontAwesomeIcon className="fa-sync" icon={faSyncAlt} size="lg" onClick={(event) => this.handleIconClick(event, () => refreshFunc(userId))} title="Refresh Account" />
          <FontAwesomeIcon className="fas fa-eye" icon={faEye} size="lg" onClick={(event) => this.handleIconClick(event, () => this.toggleLoose())} title= "Toggle folders-only view"/>
        </button>
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
          isDisplayed = {looseFilesIsDisplayed}
        />

      </div>
    );
    } else {
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
          <FontAwesomeIcon className="fa-trash" icon={faTrash} size="lg" onClick={(event) => this.handleIconClick(event, () => removeFunc(userId))} title="Remove Account" />
          <FontAwesomeIcon className="fa-sync" icon={faSyncAlt} size="lg" onClick={(event) => this.handleIconClick(event, () => refreshFunc(userId))} title="Refresh Account"/>
          <FontAwesomeIcon className="fas fa-eye-slash" icon={faEyeSlash} size="lg" onClick={(event) => this.handleIconClick(event, () => this.toggleLoose())} title="Toggle folders-only view" />
        </button>
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
          isDisplayed = {looseFilesIsDisplayed}
        />

      </div>
    );
    }
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
};

export default User;
