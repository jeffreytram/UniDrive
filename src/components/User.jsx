import React, { Component } from 'react';
import './User.css';

const File = (props) => (
  <div className="File">
    <div />
    <div>
      {props.data.name}
    </div>
  </div>
);

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
      name, infoData, removeFunc, userId, fileList,
    } = this.props;

    const { $t, TJ } = infoData;
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
          {name}
          {' '}
          (
          {$t}
          )
        </button>
        `
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

export default User;
