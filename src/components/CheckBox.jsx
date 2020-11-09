import React from 'react';
import PropTypes from 'prop-types';
import '../css/CheckBox.css';

export const CheckBox = (props) => (
  <li>
    <label className="checkbox">
      <input key={props.id} onChange={props.handleCheckChildElement} type="checkbox" checked={props.isChecked} value={props.value} />
      {' '}
      {props.value}
    </label>
  </li>
);

CheckBox.propTypes = {
  handleCheckChildElement: PropTypes.func.isRequired,
};

export default CheckBox;
