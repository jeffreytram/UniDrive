import React from 'react';
import icon from './images/unidrive-logo.png';
import '../css/Header.css';

export default function Header() {
  return (
    <div className="header-container">
      <img className="logo" src={icon} alt="UniDrive icon" />
    </div>
  );
}
