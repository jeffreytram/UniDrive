import React from 'react';
import PropTypes from 'prop-types';
import './File.css';

/* Props contains: Name, Link, Image */
export default function File(props) {
  const { userId, data, copyFunc } = props;
  const { id, webViewLink, iconLink, name } = data;
  return (
    <div className="FileContainer">
      <a href={webViewLink}>
        <img className="FileImg" src={iconLink} alt="File icon" />
        <div className="FileName">{name}</div>
      </a>
      <button type="button" onClick={() => copyFunc(userId, id)}>Copy</button>
    </div>
  );
}

File.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])).isRequired,
};
