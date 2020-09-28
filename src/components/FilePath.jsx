import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './File.css';
import './FilePath.css';


class Filepath extends Component {
  constructor() {
    super();
    this.state = {
    };
  }



  


render() {
  const {  toggleChildrenFunc, filepath, userId, filepathArray, filepathTraceFunc } = this.props;
 
      return (
        
        <span className="file-path" > 
                <span> &rarr; <button class="btn info" onClick={() => filepathTraceFunc(userId, filepath, filepathArray)}>{filepath.name}</button></span></span>
        
      );
      }
}







Filepath.propTypes = {
  toggleChildrenFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  filepathArray: PropTypes.arrayOf(PropTypes.object).isRequired,
  filepath: PropTypes.object,
};

export default Filepath;