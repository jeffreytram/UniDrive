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
  const {  toggleChildrenFunc, fileObj } = this.props;
 
      return (
        
        <span className="file-path" > 
                <span> &rarr; {fileObj.name}</span></span>
        
      );
      }
}







Filepath.propTypes = {
  toggleChildrenFunc: PropTypes.func.isRequired,

  fileObj: PropTypes.object,
};

export default Filepath;