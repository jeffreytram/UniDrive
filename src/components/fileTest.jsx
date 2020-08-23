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
        let styles = {
            backgroundColor: `hsl(${Math.floor(Math.random()*16)}, 50%, 70%)`,
            color: "#808080",
            display: "none"
        };
        const letBank = "0123456789ABCDF";
        for(let i = 0; i < 6; i++) {
            styles.backgroundColor += letBank[Math.floor(Math.random() * 16)];
        }
        return styles;
    }
    viewToggle() {
        this.setState({
            isDisplayed: !this.state.isDisplayed
        });
    }
    render() {
        let styles = this.getStyle();
        styles.display = this.state.isDisplayed ? "flex" : "none";
        return (
            <div className="User" style={styles} onClick={() => this.viewToggle()}>
                {this.props.fileList.map(file => (
                    <File
                        data = {file}
                    />
                ))}
            </div>
        );
    }
}