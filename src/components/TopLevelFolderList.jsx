import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function UserList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, isChildFunc, topLevelFolderList, toggleChildrenFunc
  } = props;
  
  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {topLevelFolderList.map((fileObj) => (
        <File
          fileObj = {fileObj}
          userId={userId}
          data={fileObj.file}
          copyFunc={copyFunc}
          childrenList={fileObj.children}
          isChildFunc={isChildFunc}
          fileList = {fileList}
          displayed = {true}
          toggleChildrenFunc={toggleChildrenFunc}
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
  isChildFunc: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
};


