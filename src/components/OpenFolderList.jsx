import React from 'react';
import PropTypes from 'prop-types';
import OpenFolder from './OpenFolder';
import '../css/FileList.css';

export default function OpenFolderList(props) {
  const {
    closePath, email, moveExternal, moveWithin, openFolder, openFolderList,
    refreshFunc, shareFile, updatePath, userId,
  } = props;

  return (
    <div className="file-list-container" style={{ display: 'flex', flexDirection: 'row' }}>
      {openFolderList.map((pathObj, i) => (
        <OpenFolder
          key={pathObj.path[0].id}
          children={pathObj.displayed}
          closePath={closePath}
          displayed
          email={email}
          moveExternal={moveExternal}
          moveWithin={moveWithin}
          oId={i}
          openFolder={openFolder}
          path={pathObj.path}
          refreshFunc={refreshFunc}
          shareFile={shareFile}
          updatePath={updatePath}
          userId={userId}
        />
      ))}
    </div>
  );
}

OpenFolderList.propTypes = {
  closePath: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  openFolder: PropTypes.func.isRequired,
  openFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshFunc: PropTypes.func.isRequired,
  shareFile: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
