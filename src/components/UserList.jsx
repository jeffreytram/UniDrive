import React from 'react';
import PropTypes from 'prop-types';
import User from './User';
import './UserList.css';

export default function UserList(props) {
  const {
    userList, parseIDToken, removeFunc, refreshFunc, copyFunc, deleteFunc, isChildFunc, openChildrenFunc,
     buildChildrenArray, filepathTraceFunc, closeFolderFunc, fileUpload, moveExternal, shareFile
  } = props;
  return (
    <div className="user-list">
      {userList.map((user) => (
        <User
          parseIDToken={parseIDToken}
          fileList={user.filesWithChildren}
          userId={user.id}
          idToken={user.idToken}
          removeFunc={removeFunc}
          refreshFunc={refreshFunc}
          fileUpload={fileUpload}
          copyFunc={copyFunc}
          deleteFunc={deleteFunc}
          isChildFunc={isChildFunc}
          topLevelFolderList={user.topLevelFolders}
          looseFileList={user.looseFiles}
          fileTrees={user.folderTrees}
          openChildrenFunc={openChildrenFunc}
          filepathTraceFunc={filepathTraceFunc}
          openFolderList={user.openFolders}
          buildChildrenArray = {buildChildrenArray}
          closeFolderFunc = {closeFolderFunc}
          shareFile={shareFile}
          moveExternal={moveExternal}
        />
      ))}
    </div>
  );
}

UserList.propTypes = {
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
  parseIDToken: PropTypes.func.isRequired,
  removeFunc: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  fileUpload: PropTypes.func.isRequired,
  copyFunc: PropTypes.func.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  isChildFunc: PropTypes.func.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  buildChildrenArray: PropTypes.func.isRequired,

};
