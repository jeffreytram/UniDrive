import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import '../css/SearchBar.css';
import 'react-datepicker/dist/react-datepicker.css';

export default function SearchBar({
  onSubmit, searchDate,
}) {
  const [lastViewDate, setStartDate] = useState();
  const [searchInput, setSearchInput] = useState('');

  const inputUpdated = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  const clearInput = () => {
    setSearchInput('');
    onSubmit('');
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
          <button type="button" id="clear-btn" onClick={clearInput}>X</button>
        </span>
        <DatePicker
          selected={lastViewDate}
          onChange={(date) => { setStartDate(date); searchDate(date); }}
          placeholderText="Last viewed by me"
          closeOnScroll
        />
        <button type="submit" style={{ display: 'none' }} onClick={() => onSubmit(searchInput)}>Search</button>
      </form>
    </div>
  );
}

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  searchDate: PropTypes.func.isRequired,
};
