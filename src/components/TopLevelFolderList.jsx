import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function TopLevelFolderList(props) {
  const {
    fileList, fileContainerStyles, userId, topLevelFolderList, openChildrenFunc,
    moveExternal, shareFile, moveWithin, loadAuth, refreshFunc
  } = props;

  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {topLevelFolderList.map((fileObj) => (
        <File
          fileObj={fileObj}
          userId={userId}
          data={fileObj.file}
          childrenList={fileObj.children}
          fileList={fileList}
          displayed
          moveExternal={moveExternal}
          shareFile={shareFile}
          moveWithin={moveWithin}
          openChildrenFunc={openChildrenFunc}
          loadAuth={loadAuth}
          refreshFunc = {refreshFunc}
        />
      ))}
    </div>
  );
}

TopLevelFolderList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
};
