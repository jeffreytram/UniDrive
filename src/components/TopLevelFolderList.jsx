import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import '../css/FileList.css';

export default function TopLevelFolderList(props) {
  const {
    loadAuth, moveExternal, moveWithin, openFolder, shareFile, topLevelFolderList, userId, refreshFunc
  } = props;

  return (
    <div className="topFolder">
      <div className="file-list-container" style={{ display: 'flex', flexDirection: 'row' }}>
        {topLevelFolderList.map((folderObj) => (
          <File
            key={folderObj.folder.id}
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
          />
        ))}
      </div>
    </div>
  );
}

TopLevelFolderList.propTypes = {
  loadAuth: PropTypes.func.isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  openFolder: PropTypes.func.isRequired,
  shareFile: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.number.isRequired,
};
