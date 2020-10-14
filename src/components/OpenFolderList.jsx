import React from 'react';
import PropTypes from 'prop-types';
import OpenFolder from './OpenFolder';
import './FileList.css';

export default function OpenFolderList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, deleteFunc, renameFunc, openChildrenFunc,
    openFolderList, buildChildrenArray, filepathTraceFunc, closeFolderFunc,
  } = props;

  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {openFolderList.map((fileObj) => (
        <OpenFolder
          fileObj={fileObj}
          userId={userId}
          data={fileObj.file}
          copyFunc={copyFunc}
          deleteFunc={deleteFunc}
          renameFunc={renameFunc}
          childrenList={fileObj.children}
          fileList={fileList}
          displayed
          openChildrenFunc={openChildrenFunc}
          filepathTraceFunc={filepathTraceFunc}
          filePath={fileObj.filepath}
          buildChildrenArray={buildChildrenArray}
          closeFolderFunc={closeFolderFunc}

        />
      ))}
    </div>
  );
}

OpenFolderList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  copyFunc: PropTypes.func.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  renameFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  openFolderList: PropTypes.arrayOf(PropTypes.object).isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
};
