import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function LooseFileList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, deleteFunc, renameFunc, openChildrenFunc,
    looseFileList, moveExternal, shareFile, moveWithin, isDisplayed, loadAuth, refreshFunc, email
  } = props;

  if (isDisplayed) {
    return (
      <div className="file-list-container" style={fileContainerStyles}>
        {looseFileList.map((file) => (
          <File
            userId={userId}
            data={file}
            copyFunc={copyFunc}
            deleteFunc={deleteFunc}
            renameFunc={renameFunc}
            childrenList={[]}
            fileList={fileList}
            displayed
            moveExternal={moveExternal}
            shareFile={shareFile}
            moveWithin={moveWithin}
            openChildrenFunc={openChildrenFunc}
            loadAuth={loadAuth}
            refreshFunc = {refreshFunc}
            email = {email}
          />
        ))}
      </div>
    );
  }
  return (null);
}

LooseFileList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  copyFunc: PropTypes.func.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  renameFunc: PropTypes.func.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  isDisplayed: PropTypes.bool.isRequired,
};
