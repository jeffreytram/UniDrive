import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function TopLevelFolderList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, deleteFunc, renameFunc, topLevelFolderList, 
    openChildrenFunc, moveExternal, shareFile, moveWithin, loadAuth
  } = props;

  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {topLevelFolderList.map((fileObj) => (
        <File
          fileObj={fileObj}
          userId={userId}
          data={fileObj.file}
          copyFunc={copyFunc}
          deleteFunc={deleteFunc}
          renameFunc={renameFunc}
          childrenList={fileObj.children}
          fileList={fileList}
          displayed
          moveExternal={moveExternal}
          shareFile={shareFile}
          moveWithin={moveWithin}
          openChildrenFunc={openChildrenFunc}
          loadAuth={loadAuth}
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
  deleteFunc: PropTypes.func.isRequired,
  renameFunc: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
};
