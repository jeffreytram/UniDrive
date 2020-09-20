import React from 'react';
import PropTypes from 'prop-types';
import './File.css';

/* Props contains: Name, Link, Image */
export default function File(props) {
  const { userId, data, copyFunc } = props;
  const {
    id, webViewLink, iconLink, name,
  } = data;
  return (
    <div className="file-container">
      <div className="file-image-container">
        <a href={webViewLink}>
          <img className="file-img" src={iconLink} alt="File icon" />
        </a>
      </div>
      <div className="file-name">
        <a href={webViewLink}>{name}</a>
      </div>
      <button type="button" className="copy-btn" onClick={() => copyFunc(userId, id)}>Copy</button>
    </div>
  );
}

File.propTypes = {
  userId: PropTypes.number.isRequired,
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])).isRequired,
  copyFunc: PropTypes.func.isRequired,
};
