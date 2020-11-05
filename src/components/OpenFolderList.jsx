import React from 'react';
import PropTypes from 'prop-types';
import OpenFolder from './OpenFolder';
import '../css/FileList.css';

export default function OpenFolderList(props) {
  const {
    userId, openFolderList, moveExternal, moveWithin, shareFile, loadAuth, email,
    openFolder, closePath, updatePath
  } = props;

  return (
    <div className="file-list-container" style={{display: 'flex', flexDirection: 'row'}}>
      {openFolderList.map((pathObj, i) => (
        <OpenFolder
          path={pathObj.path}
          children={pathObj.displayed}
          oId={i}
          userId={userId}
          displayed
          shareFile={shareFile}
          moveExternal={moveExternal}
          moveWithin={moveWithin}
          loadAuth={loadAuth}
          email={email}
          openFolder={openFolder}
          closePath={closePath}
          updatePath={updatePath}
        />
      ))}
    </div>
  );
}

OpenFolderList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  openFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
};
