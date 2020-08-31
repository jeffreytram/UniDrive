import React, { Component } from 'react';
import './User.css';
//background-color
//color for text color

/*
Props:
    data: object from array
    ...
*/
const File = props => (
  <div className="File">
    <div>

    </div>
    <div>
      {props.data.name}
    </div>
  </div>
);

/*
Should below be part of state??
Props:
    fileList: array
    credentials: idk auth object?
*/
class User extends Component {
  constructor() {
    super();
    this.state = {
      isDisplayed: false
    }
  }
  a
  viewToggle() {
    this.setState({
      isDisplayed: !this.state.isDisplayed
    });
  }

  render() {
    const { $t, TJ } = this.props.infoData
    let fileContainerStyles = {
      display: this.state.isDisplayed ? "flex" : "none"
    }
    return (
      <div className="User">
        <div className="UserBanner" onClick={() => this.viewToggle()}>
          <img height="15px" src={TJ}/>
          {this.props.name} ({$t})
        </div>

        <div className="UserFilesContainer" style={fileContainerStyles}>
          {this.props.fileList.map(file => (
            <File
              data={file}
            />
          ))}
        </div>
      </div>
    );
  }
}

/* const letBank = "0123456789ABCDF";
for(let i = 0; i < 6; i++) {
    styles.backgroundColor += letBank[Math.floor(Math.random() * 16)];
} */

export default User;