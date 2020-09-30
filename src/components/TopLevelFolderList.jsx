import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function TopLevelFolderList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, topLevelFolderList, openChildrenFunc
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
          fileList = {fileList}
          displayed = {true}
          openChildrenFunc={openChildrenFunc}
        />
      ))}
    </div>
  );
}

TopLevelFolderList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  copyFunc: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
};


