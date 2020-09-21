import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function UserList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, isChildFunc, parentIdList, parentFiles,  sortedFolders, toggleChildrenFunc
  } = props;
  
  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {fileList.map((fileObj) => (
        <File
          userId={userId}
          data={fileObj.file}
          copyFunc={copyFunc}
          childrenList={fileObj.children}
          isChildFunc={isChildFunc}
          parentIdList={parentIdList}
          parentFiles={parentFiles}
          sortedFolders={sortedFolders}
          fileList = {fileList}
          displayed = {fileObj.display}
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
  parentIdList: PropTypes.arrayOf(PropTypes.string).isRequired,
  parentFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortedFolders: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
};
