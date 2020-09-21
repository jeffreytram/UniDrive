import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileList from './FileList';
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
      infoData, parseIDToken, removeFunc, userId, fileList, refreshFunc, copyFunc, isChildFunc, parentIdList, parentFiles, sortedFolders, toggleChildrenFunc
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

        <FileList
          fileList={fileList}
          fileContainerStyles={fileContainerStyles}
          userId={userId}
          copyFunc={copyFunc}
          isChildFunc={isChildFunc}
          parentIdList={parentIdList}
          parentFiles={parentFiles}
          sortedFolders={sortedFolders}
          toggleChildrenFunc={toggleChildrenFunc}
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
  parentIdList: PropTypes.arrayOf(PropTypes.string).isRequired,
  parentFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortedFolders: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
};

export default User;
