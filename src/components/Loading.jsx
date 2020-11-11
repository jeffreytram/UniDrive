import React from 'react';
import '../css/Loading.css';

export default function Header() {
  return (
    <div className="loading-container">
      <h3 className="loading-text">Loading...</h3>
      <div className="lds-facebook">
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
