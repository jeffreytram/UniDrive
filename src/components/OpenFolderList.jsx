import React from 'react';
import PropTypes from 'prop-types';
import OpenFolder from './OpenFolder';
import './FileList.css';

export default function UserList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, isChildFunc, topLevelFolderList, toggleChildrenFunc,
     openFolderList, buildChildrenArray, filepathTraceFunc
  } = props;
  
  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {openFolderList.map((fileObj) => (
        <OpenFolder
          fileObj = {fileObj}
          userId={userId}
          data={fileObj.file}
          copyFunc={copyFunc}
          childrenList={fileObj.children}
          isChildFunc={isChildFunc}
          fileList = {fileList}
          displayed = {true}
          toggleChildrenFunc={toggleChildrenFunc}
          filepathTraceFunc={filepathTraceFunc}
          filePath = {fileObj.filepath}
          buildChildrenArray = {buildChildrenArray}
          
        />
      ))}
    </div>
  );
}

UserList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.Object).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  copyFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  isChildFunc: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
  openFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
};



