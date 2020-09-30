import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilePath from './FilePath';
import './OpenFolder.css';
import File from './File';



class OpenFolder extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

 
  

  

/* Props contains: Name, Link, Image */
//export default function File(props) {
render() {
  const { userId, data, copyFunc, fileList, openChildrenFunc, 
    fileObj, filePath, filepathTraceFunc, closeFolderFunc } = this.props;
  const {
    id, webViewLink, iconLink, name, mimeType, parents
  } = data;


    return (
    <div className ="open-folder">
          <div className="file-path-container">
          <button type="button" className="copy-btn" onClick={() => closeFolderFunc(fileObj, userId)}>Close</button>
              {fileObj.filepath.map((filep) => (
              <FilePath
                filepath = {filep}
                userId={userId}
                filepathArray = {filePath}
                filepathTraceFunc={filepathTraceFunc}
        
              />
              ))}
            
        </div>

        <div className="current-folder">
            {fileObj.children.map((file) => (
            <File
            userId={userId}
            data={file}
            copyFunc={copyFunc}
            fId={fileObj.fId}
            fileList = {fileList}
            displayed = {true}
            openChildrenFunc={openChildrenFunc}
            fileObj ={file}
          
            
    
            />
            ))}
      
        </div>
    </div>

        );
  }
}




OpenFolder.propTypes = {
  userId: PropTypes.number.isRequired,
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])).isRequired,
  copyFunc: PropTypes.func.isRequired,
  isChildFunc: PropTypes.func.isRequired,
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  fileObj: PropTypes.arrayOf(PropTypes.object),
  filePath: PropTypes.arrayOf(PropTypes.string),
};

export default OpenFolder;