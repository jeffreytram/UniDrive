import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../css/FilePath.css';

class Filepath extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const {
      folder, oId, pIndex, updatePath, userId,
    } = this.props;

    return (
      <span className="file-path">
        <span>
          {' '}
          <FontAwesomeIcon icon={faChevronRight} />
          <button type="button" className="path-btn" onClick={() => updatePath(userId, oId, pIndex)}>{folder.name}</button>
        </span>
      </span>
    );
  }
}

Filepath.propTypes = {
  folder: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])).isRequired,
  oId: PropTypes.number.isRequired,
  pIndex: PropTypes.number.isRequired,
  updatePath: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default Filepath;
