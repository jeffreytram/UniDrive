import React from 'react';
import Icon from './images/icon.png';
import './Header.css';

export default function Header() {
    return (
        <div className="HeaderContainer">
            <img className="Icon" src={Icon} alt = "Icon" />
        </div>
    )
}