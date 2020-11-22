import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import icon from './images/unidrive-logo.png';
import iconWhite from './images/unidrive-logo-white.png';
import '../css/Header.css';

export default function Header({
  addedAccount, onSubmit, refreshAllFunc, syncMessage,
}) {
  let currentTheme = localStorage.getItem('theme');
  if (currentTheme === null) currentTheme = 'light';
  const [theme, setTheme] = useState(currentTheme);

  const body = document.getElementsByTagName('body')[0];

  if (theme === 'dark') {
    body.classList.add('dark-theme');
  }

  const toggleTheme = () => {
    if (theme === 'dark') {
      body.classList.remove('dark-theme');
      setTheme('light');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark-theme');
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="header-container">
      <img className="logo" src={theme === 'light' ? icon : iconWhite} alt="UniDrive icon" />
      {addedAccount && (
        <span className="search-container">
          <SearchBar
            onSubmit={onSubmit}
          />
        </span>
      )}
      {addedAccount && (
      <div className="header-button-container">
        <button type="button" className="header-button toggle-theme" onClick={() => toggleTheme()}>
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} size="lg" title="Toggle theme" />
        </button>
        <button type="button" className="header-button refresh" id="signin-btn" onClick={() => refreshAllFunc()}>
          <FontAwesomeIcon icon={faSyncAlt} size="lg" title="Sync all accounts" />
        </button>
        <button type="button" disabled className="sync-message">
          Last synced:
          {' '}
          {syncMessage}
        </button>
      </div>
      )}
    </div>
  );
}

Header.propTypes = {
  addedAccount: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  refreshAllFunc: PropTypes.func.isRequired,
  syncMessage: PropTypes.string.isRequired,
};
