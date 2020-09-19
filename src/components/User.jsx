import React, { Component } from 'react';
import PropTypes from 'prop-types';
import File from './File';
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
      infoData, removeFunc, userId, fileList, refreshFunc, copyFunc,
    } = this.props;
    const Ad = infoData.name;
    const $t = infoData.email;
    const TJ = infoData.picture;
    // const { Ad, $t, TJ } = infoData;
    const fileContainerStyles = {
      display: isDisplayed ? 'flex' : 'none',
    };

    return (
      <div className="User">
        <button
          type="button"
          className="UserBanner"
          onClick={() => this.viewToggle()}
          onKeyDown={() => this.viewToggle()}
        >
          <img className="profile-picture" src={TJ} alt="UniDrive logo" />
          <span className="profile-text">
            <span className="profile-name">{Ad}</span>
            {' '}
            <span className="profile-email">
              (
              {$t}
              )
            </span>
          </span>
        </button>
        {' '}
        <button type="button" className="delete-btn" id="remove-btn" onClick={() => removeFunc(userId)}> Remove Account </button>
        <button type="button" className="refresh-btn" id="refresh-btn" onClick={() => refreshFunc(userId)}> Refresh Account </button>

        <div className="UserFilesContainer" style={fileContainerStyles}>
          {fileList.map((file) => (
            <File
              userId={userId}
              data={file}
              copyFunc={copyFunc}
            />
          ))}
        </div>
      </div>
    );
  }
}

User.propTypes = {
  infoData: PropTypes.objectOf(PropTypes.string).isRequired,
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.number.isRequired,
  removeFunc: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
};

export default User;
