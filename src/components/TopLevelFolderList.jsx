import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import '../css/FileList.css';
import OpenFolder from './OpenFolder';

export default function TopLevelFolderList(props) {
  const {
    userId, topLevelFolderList, moveExternal, shareFile,
    moveWithin, loadAuth, refreshFunc, email, openFolder
  } = props;

  return (
    <div className="topFolder">
    <div className="file-list-container" style={{display: 'flex', flexDirection: 'row'}}>
      {topLevelFolderList.map((folderObj) => (
        <File
          userId={userId}
          data={folderObj.folder}
          oId={null}
          displayed
          moveExternal={moveExternal}
          shareFile={shareFile}
          moveWithin={moveWithin}
          openFolder={openFolder}
          loadAuth={loadAuth}
          refreshFunc={refreshFunc}
          email={email}
        />
      ))}
    </div>
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
