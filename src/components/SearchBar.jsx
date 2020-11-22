import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import '../css/SearchBar.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function SearchBar({ onSubmit }) {
  const [lastViewDate, setStartDate] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const inputUpdated = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  const clearSearch = () => {
    setSearchInput('');
    onSubmit('', lastViewDate);
  };

  const clearDate = () => {
    setStartDate(null);
    onSubmit(searchInput, null);
  };

  return (
    <div className="search-form">
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <span className="search-input-container">
          <FontAwesomeIcon className="search-icon" icon={faSearch} />
          <input
            className="form-control"
            id="searchbarform"
            name="search"
            onInput={inputUpdated}
            placeholder="Search for a file..."
            type="input"
            value={searchInput}
          />
          {searchInput.length > 0 && (
            <button type="button" className="clear-btn clear-search" onClick={clearSearch}>X</button>
          )}
        </span>
        <span>
          <DatePicker
            selected={lastViewDate}
            onChange={(date) => { setStartDate(date); onSubmit(searchInput, date);}}
            placeholderText="Last viewed after..."
            closeOnScroll
          />
          {lastViewDate && (
            <button type="button" className="clear-btn clear-date" onClick={clearDate}>X</button>
          )}
        </span>
        <button type="submit" style={{ display: 'none' }} onClick={() => onSubmit(searchInput, lastViewDate)}>Search</button>
      </form>
    </div>
  );
}

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
