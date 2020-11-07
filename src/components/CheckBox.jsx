import React from 'react';
import PropTypes from 'prop-types';

export const CheckBox = (props) => {
  return (
    <li>
      <input key={props.id} onChange={props.handleCheckChildElement} type="checkbox" checked={props.isChecked} value={props.value} />
      {' '}
      {props.value}
    </li>
  );
};

CheckBox.propTypes = {
  handleCheckChildElement: PropTypes.func.isRequired,
};

export default CheckBox;
