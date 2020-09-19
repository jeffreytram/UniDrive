import React from 'react';
import PropTypes from 'prop-types';
import './File.css';

/* Props contains: Name, Link, Image */
export default function File(props) {
  const { data } = props;
  const { webViewLink, iconLink, name } = data;
  return (
    <a href={webViewLink} target="_blank">
      <div className="FileContainer">
        <img className="FileImg" src={iconLink} alt="File icon" />
        <div className="FileName">{name}</div>
      </div>
    </a>
  );
}

File.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])).isRequired,
};
