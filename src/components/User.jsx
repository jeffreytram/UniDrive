import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LooseFileList from './LooseFileList';
import TopLevelFolderList from './TopLevelFolderList';
import OpenFolderList from './OpenFolderList';
import './User.css';

class User extends Component {
  constructor() {
    super();
    this.state = {
      isDisplayed: false,
    };
  }

  viewToggle() {
    this.setState((prevState) => ({
      isDisplayed: !prevState.isDisplayed,
    }));
  }

  render() {
    const { isDisplayed } = this.state;
    const {
      infoData, parseIDToken, removeFunc, userId, fileList, refreshFunc, copyFunc, isChildFunc, topLevelFolderList
      , toggleChildrenFunc, looseFileList, openFolderList, buildChildrenArray,
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
        </button>
        {' '}
        <button type="button" className="delete-btn" id="remove-btn" onClick={() => removeFunc(userId)}> Remove Account </button>
        <button type="button" className="refresh-btn" id="refresh-btn" onClick={() => refreshFunc(userId)}> Refresh Account </button>

      <TopLevelFolderList
      fileList={fileList}
      fileContainerStyles={fileContainerStyles}
      userId={userId}
      copyFunc={copyFunc}
      isChildFunc={isChildFunc}
      topLevelFolderList={topLevelFolderList}
      toggleChildrenFunc={toggleChildrenFunc}
        />

      <OpenFolderList
      fileList={fileList}
      fileContainerStyles={fileContainerStyles}
      userId={userId}
      copyFunc={copyFunc}
      isChildFunc={isChildFunc}
      topLevelFolderList={topLevelFolderList}
      toggleChildrenFunc={toggleChildrenFunc}
      openFolderList = {openFolderList}
      buildChildrenArray = {buildChildrenArray}
       />
  
      <LooseFileList
          fileList={fileList}
          fileContainerStyles={fileContainerStyles}
          userId={userId}
          copyFunc={copyFunc}
          isChildFunc={isChildFunc}
          toggleChildrenFunc={toggleChildrenFunc}
          looseFileList = {looseFileList}
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
  isChildFunc: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  folderTrees: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
  openFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
};

export default User;
