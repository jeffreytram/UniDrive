import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import icon from './images/unidrive-logo.png';
import '../css/Header.css';

export default function Header({
  addedAccount, onSubmit, refreshAllFunc, syncMessage,
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
        <button type="button" className="header-button" id="signin-btn" onClick={() => refreshAllFunc()}>
          <FontAwesomeIcon icon={faSyncAlt} size="lg" />
          {' '}
          Sync now
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
