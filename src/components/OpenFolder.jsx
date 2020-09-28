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
  const { userId, data, copyFunc, childrenList, isChildFunc, parentIdList, parentFiles, sortedFolders, fileList, displayed, toggleChildrenFunc, 
    fileObj, filePath, buildChildrenArray, filepathTraceFunc } = this.props;
  const {
    id, webViewLink, iconLink, name, mimeType, parents
  } = data;


    return (
    <div className ="open-folder">
          <div className="file-path-container">
              {fileObj.filepath.map((filep) => (
              <FilePath
                filepath = {filep}
                toggleChildrenFunc={toggleChildrenFunc}
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
            isChildFunc={isChildFunc}
            fileList = {fileList}
            displayed = {true}
            toggleChildrenFunc={toggleChildrenFunc}
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
  childrenList: PropTypes.arrayOf(PropTypes.object).isRequired,
  isChildFunc: PropTypes.func.isRequired,
  parentIdList: PropTypes.arrayOf(PropTypes.string).isRequired,
  parentFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortedFolders: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  displayed: PropTypes.bool.isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  fileObj: PropTypes.arrayOf(PropTypes.object),
  filePath: PropTypes.arrayOf(PropTypes.string),
  buildChildrenArray: PropTypes.func.isRequired,
};

export default OpenFolder;