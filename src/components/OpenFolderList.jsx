import React from 'react';
import PropTypes from 'prop-types';
import OpenFolder from './OpenFolder';
import '../css/FileList.css';

export default function OpenFolderList(props) {
  const {
    closePath, loadAuth, moveExternal, moveWithin, openFolder, openFolderList,
    shareFile, updatePath, userId,
  } = props;

  return (
    <div className="file-list-container" style={{display: 'flex', flexDirection: 'row'}}>
      {openFolderList.map((pathObj, i) => (
        <OpenFolder
          key={pathObj.path[0].id}
          path={pathObj.path}
          children={pathObj.displayed}
          oId={i}
          userId={userId}
          displayed
          shareFile={shareFile}
          moveExternal={moveExternal}
          moveWithin={moveWithin}
          loadAuth={loadAuth}
          openFolder={openFolder}
          closePath={closePath}
          updatePath={updatePath}
        />
      ))}
    </div>
  );
}

OpenFolderList.propTypes = {
  closePath: PropTypes.func.isRequired,
  loadAuth: PropTypes.func.isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  openFolder: PropTypes.func.isRequired,
  openFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  shareFile: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
