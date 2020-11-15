import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import RequestProgressElement from './RequestProgressElement';
import '../css/RequestProgress.css';

export default function RequestProgress({ clearRequests, uploadRequests }) {
  return (
    <div className="request-progress-container">
      <div className="progress-header">
        Upload Progress
        <button type="button" className="close-progress-button" onClick={() => clearRequests()}>
          <FontAwesomeIcon className="close-progress-button" icon={faTimes} size="lg" />
        </button>
      </div>
      <div className="progress-content-container">
        {uploadRequests.map((requested) => (
          <RequestProgressElement
            requested={requested}
          />
        ))}
      </div>
    </div>
  );
}

RequestProgress.propTypes = {
  clearRequests: PropTypes.func.isRequired,
  uploadRequests: PropTypes.arrayOf(PropTypes.shape({
    request: PropTypes.object, // eslint-disable-line
    name: PropTypes.string,
  })).isRequired,
};
