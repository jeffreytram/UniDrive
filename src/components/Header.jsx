import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import SearchBar from './SearchBar';
import icon from './images/unidrive-logo.png';
import iconWhite from './images/unidrive-logo-white.png';
import '../css/Header.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Header({
  addedAccount, onSubmit, refreshAllFunc, syncMessage, searchDate, twoCalls
}) {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const cookieExpire = new Date(year + 20, month, day);

  const cookieOptions = {
    path: '/',
    expires: cookieExpire,
  };

  const [lastViewDate, setStartDate] = useState(new Date());

  const cookies = new Cookies();
  const cookie = cookies.getAll();
  let currentTheme = 'light';
  Object.values(cookie).forEach((cook) => {
    if (cook === 'dark') {
      currentTheme = 'dark';
    }
  });

  const [theme, setTheme] = useState(currentTheme);

  const body = document.getElementsByTagName('body')[0];

  if (theme === 'dark') {
    body.classList.add('dark-theme');
  }

  const toggleTheme = () => {
    if (theme === 'dark') {
      body.classList.remove('dark-theme');
      setTheme('light');
      cookies.set('theme', 'light', cookieOptions);
    } else {
      body.classList.add('dark-theme');
      setTheme('dark');
      cookies.set('theme', 'dark', cookieOptions);
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
          <button id="clear-btn" onClick={() => {onSubmit(""); document.getElementById('searchbarform').value = ''}}>Clear</button>
          <DatePicker selected={lastViewDate} onChange={date => { setStartDate(date); searchDate(date)}}
            placeholderText="Last viewed by me" closeOnScroll={true}/>
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
  searchDate: PropTypes.func.isRequired,
  refreshAllFunc: PropTypes.func.isRequired,
  syncMessage: PropTypes.string.isRequired,
};
