import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import '../css/FileList.css';

export default function TopLevelFolderList(props) {
  const {
    email, moveExternal, moveWithin, openFolder, refreshFunc, shareFile, topLevelFolderList, userId, isFiltering, isSearching
  } = props;

  return (
    <div className="topFolder">
      <div className="file-list-container">
        {topLevelFolderList.map((folderObj) => (
          <File
            key={folderObj.folder.id}
            data={folderObj.folder}
            email={email}
            moveExternal={moveExternal}
            moveWithin={moveWithin}
            oId={-1}
            openFolder={openFolder}
            refreshFunc={refreshFunc}
            shareFile={shareFile}
            userId={userId}
            isSearching = {isSearching}
            isFiltering = {isFiltering}
          />
        ))}
      </div>
    </div>
  );
}

TopLevelFolderList.propTypes = {
  email: PropTypes.string.isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  openFolder: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  shareFile: PropTypes.func.isRequired,
  topLevelFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userId: PropTypes.number.isRequired,
};
