import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import '../css/FileList.css';

export default function LooseFileList(props) {
  const {
    isDisplayed, loadAuth, looseFileList, moveExternal, moveWithin, refreshFunc, shareFile, userId,
  } = props;

  if (isDisplayed) {
    return (
      <div className="file-list-container" style={{ display: 'flex', flexDirection: 'row' }}>
        {looseFileList.map((file) => (
          <File
            key={file.id}
            userId={userId}
            data={file}
            displayed
            moveExternal={moveExternal}
            shareFile={shareFile}
            moveWithin={moveWithin}
            loadAuth={loadAuth}
            refreshFunc={refreshFunc}
          />
        ))}
      </div>
    );
  }
  return (null);
}

LooseFileList.propTypes = {
  isDisplayed: PropTypes.bool.isRequired,
  loadAuth: PropTypes.func.isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  shareFile: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
