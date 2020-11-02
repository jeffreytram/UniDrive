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
      filepath, userId, filepathArray, filepathTraceFunc,
    } = this.props;

    return (

      <span className="file-path">
        <span>
          {' '}
          &rarr;
          <button type="button" className="btn info" onClick={() => filepathTraceFunc(userId, filepath, filepathArray)}>{filepath.name}</button>
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
