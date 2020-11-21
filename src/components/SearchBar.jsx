import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
    };
  }

  submitSearchInput = (e) => {
    const { searchInput } = this.state;
    const { onSubmit } = this.props;
    onSubmit(searchInput);
    return false;
  }

  inputUpdated = (e) => {
    const { value } = e.target;
    this.setState({ searchInput: value });
  }

  render() {
    return (
      <div className="search-form">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <FontAwesomeIcon className="search-icon" icon={faSearch} />
          <input
            className="form-control"
            name="search"
            onInput={this.inputUpdated}
            placeholder="Search for a file..."
            type="input"
            value={this.state.searchInput}
          />
          <button type="submit" style={{ display: 'none' }} onClick={() => this.submitSearchInput()}>Search</button>
        </form>
      </div>
    );
  }
}

export default SearchBar;

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
