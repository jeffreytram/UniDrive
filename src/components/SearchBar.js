import React, { Component } from 'react';

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchInput: ''
    }
    this.inputUpdated = this.inputUpdated.bind(this);
    this.submitSearchInput = this.submitSearchInput.bind(this);
  }

  submitSearchInput(e) {
    //e.preventDefault();

    const { searchInput } = this.state;
    const { onSubmit } = this.props;
    onSubmit(searchInput)
    this.setState({ searchInput:''});
    return false;
  }

  inputUpdated(e) {
    const { value } = e.target;

    this.setState({ searchInput: value });
  }
  render() {
    return (
      <div className="search-form">
        <form onSubmit={(e) => {e.preventDefault(); (e) => this.submitSearchInput()}}>
          <label htmlFor="search">Search By File Name </label>
          <input
            className="form-control"
            type="input"
            name="search"
            value={this.state.searchInput}
            onInput={this.inputUpdated}/>
            <button type="submit" onClick={() => this.submitSearchInput()}>Search</button>
        </form>
      </div>
    );
  }
}

export default SearchBar;
