import React from 'react';
import PropTypes from 'prop-types';
import icon from './images/unidrive-logo.png';
import '../css/Header.css';

export default function Header({ addedAccount, authorizeUser, refreshAllFunc }) {
  return (
    <div className="header-container">
      <img className="logo" src={icon} alt="UniDrive icon" />
      {addedAccount && (
        <div className="header-button-container">
          <button type="button" className="main-button add" id="signin-btn" onClick={() => authorizeUser()}>Add an Account</button>
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
  refreshAllFunc: PropTypes.func.isRequired,
};
