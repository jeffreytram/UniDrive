import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/File.css';
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
          &rarr;
          <button type="button" className="btn info" onClick={() => updatePath(userId, oId, pIndex)}>{folder.name}</button>
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
