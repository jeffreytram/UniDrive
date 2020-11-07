import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Checklist.css';
import CheckBox from './CheckBox';

class Checklist extends Component {
  constructor() {
    super();
    this.state = {
      fruites: [
        { id: 1, value: 'Google Docs', isChecked: false },
        { id: 2, value: 'Google Sheets', isChecked: false },
        { id: 3, value: 'Google Slides', isChecked: false },
        { id: 4, value: 'PDF', isChecked: false },
      ],
      displayed: 'none',
    };
  }

  viewToggle = () => {
    this.setState((prevState) => {
      const display = prevState.displayed;
      return {
        displayed: (display === 'none') ? 'block' : 'none',
      };
    });
  }

  handleAllChecked = (event) => {
    const { fruites } = this.state;
    fruites.forEach((fruite) => fruite.isChecked = false);
    this.setState({ fruites }, () => { this.applyFilter(); });
  }

  handleCheckChildElement = (event) => {
    const { fruites } = this.state;
    fruites.forEach((fruite) => {
      if (fruite.value === event.target.value) fruite.isChecked = event.target.checked;
    });
    this.setState({ fruites }, () => { this.applyFilter(); });
  }

applyFilter = () => {
  const { userId } = this.props;
  const { filterFunc } = this.props;
  let filterBy = '';
  const { fruites } = this.state;
  let firstChecked = -1;
  let count = 0;
  fruites.forEach((fruite) => {
    if (fruite.isChecked) {
      filterBy = `${filterBy} ${fruite.value}`;
      if (firstChecked === -1) {
        firstChecked = count;
      }
    }
    count++;
  });
  filterFunc(userId, filterBy, firstChecked);
}

render() {
  return (
    <div className="Checklist">
      <button
        type="button"
        className="ChecklistButton"
        onClick={() => this.viewToggle()}
        onKeyDown={() => this.viewToggle()}
      >
        {' '}
        Toggle Filter
        {' '}
      </button>
      <div style={{ display: this.state.displayed }} className="ChecklistItems">
        <button type="button" onClick={() => this.handleAllChecked()}> Clear Filter </button>
        <ul>
          {
          this.state.fruites.map((fruite, index) => (<CheckBox key={index} handleCheckChildElement={this.handleCheckChildElement} {...fruite} />))
        }
        </ul>
      </div>
    </div>
  );
}
}

Checklist.propTypes = {
  filterFunc: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default Checklist;
