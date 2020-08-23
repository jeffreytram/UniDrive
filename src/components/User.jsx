import React, {Component} from 'react';
import './User.css';
//background-color
//color for text color

/*
Props:
    data: object from array
    ...
*/
const File = props => (
    <div className="File">{props.data.name}</div>
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
    getStyle() {
        return {
            backgroundColor: `hsl(${Math.floor(Math.random()*16)}, 50%, 70%)`,
            color: "#808080",
        };
    }
    viewToggle() {
        this.setState({
            isDisplayed: !this.state.isDisplayed
        });
    }
    render() {
        let bannerStyles = this.getStyle();
        let fileContainerStyles = {
            display: this.state.isDisplayed ? "flex" : "none"
        }
        return (
            <div className="User">
                <div className="UserBanner" style={bannerStyles} onClick={() => this.viewToggle()}>
                    {this.props.name}
                </div>
                <div className="UserFilesContainer" style={fileContainerStyles}>
                    {this.props.fileList.map(file => (
                        <File
                            data = {file}
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