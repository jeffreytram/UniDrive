import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import icon from './images/unidrive-logo.png';
import '../css/Header.css';

export default function Header({
  addedAccount, authorizeUser, onSubmit, refreshAllFunc,
}) {
  return (
    <div className="header-container">
      <img className="logo" src={icon} alt="UniDrive icon" />
      {addedAccount && (
        <span className="search-container">
          <SearchBar
            onSubmit={onSubmit}
          />
        </span>
      )}
      {addedAccount && (
      <div className="header-button-container">
        <button type="button" className="main-button add" id="signin-btn" onClick={() => authorizeUser()}>
          <FontAwesomeIcon icon={faUserPlus} size="lg"/>
        </button>
        <button type="button" className="main-button refresh" id="refreshAll-btn" onClick={() => refreshAllFunc()}>
          Refresh All
        </button>
      </div>
      )}
    </div>
  );
}

Header.propTypes = {
  addedAccount: PropTypes.bool.isRequired,
  authorizeUser: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  refreshAllFunc: PropTypes.func.isRequired,
};
