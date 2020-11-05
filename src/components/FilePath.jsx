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
      userId, oId, pIndex, folder, updatePath
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
  filepathTraceFunc: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  filepathArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  filepath: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Filepath;
