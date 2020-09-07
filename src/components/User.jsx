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
      infoData, removeFunc, userId, fileList,
    } = this.props;
    const { Ad, $t, TJ } = infoData;
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
          <img height="15px" src={TJ} alt="UniDrive logo" />
          {Ad}
          {' '}
          (
          {$t}
          )
        </button>
        {' '}
        <button type="button" id="remove-btn" onClick={() => removeFunc(userId)}> Remove Account </button>

        <div className="UserFilesContainer" style={fileContainerStyles}>
          {fileList.map((file) => (
            <File
              data={file}
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
};

export default User;
