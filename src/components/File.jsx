import React from 'react';
import PropTypes from 'prop-types';
import './File.css';

/* Props contains: Name, Link, Image */
export default function File(props) {
  const { userId, data, copyFunc } = props;
  const { id, webViewLink, iconLink, name, mimeType } = data;
  if (mimeType === 'application/vnd.google-apps.folder') {
  return (
    <div className="FileContainer">
        <img className="FileImg" src={iconLink} alt="File icon" />
        <div className="FileName">{name}</div>
    </div>
  );
  } else {
    return (
      <div className="FileContainer">
        <a href={webViewLink} target = '_blank'>
          <img className="FileImg" src={iconLink} alt="File icon" />
          <div className="FileName">{name}</div>
        </a>
        <button type="button" onClick={() => copyFunc(userId, id)}>Copy</button>
      </div>
    );
  }
}

File.propTypes = {
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])).isRequired,
};
