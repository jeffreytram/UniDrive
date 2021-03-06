import React from 'react';
import PropTypes from 'prop-types';
import preview from './images/preview.png';
import '../css/Welcome.css';

export default function Welcome({ authorizeUser }) {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">All Your Drives in One Place</h1>
        <div className="getting-started">
          <h3 className="getting-started-description">Get started by adding a Google Account.</h3>
          <button type="button" className="welcome-button" id="signin-btn" onClick={() => authorizeUser()}>Add an Account</button>
        </div>
        <img className="preview" src={preview} alt="UniDrive Preview" />
      </div>
    </div>
  );
}

Welcome.propTypes = {
  authorizeUser: PropTypes.func.isRequired,
};
