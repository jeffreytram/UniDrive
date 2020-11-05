import React from 'react';
import icon from './images/icon.png';
import '../css/Header.css';

export default function Header() {
  return (
    <div className="header-container">
      <img className="logo" src={icon} alt="Icon" />
    </div>
  );
}
