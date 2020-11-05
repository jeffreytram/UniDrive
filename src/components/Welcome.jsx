import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import '../css/Welcome.css';

export default function Welcome({ authorizeUser }) {
  return (
    <div>
      <Header />
      <div className="getting-started-container">
        <h2>Welcome to UniDrive!</h2>
        <h3>Get started by adding an account.</h3>
        <button type="button" className="main-button add" id="signin-btn" onClick={() => authorizeUser()}>Add an Account</button>
      </div>
    </div>
  );
}
