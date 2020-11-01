import React from 'react';
import PropTypes from 'prop-types';
import User from './User';
import './UserList.css';

export default function UserList(props) {
  const {
    userList, parseIDToken, removeFunc, refreshFunc, isChildFunc, openChildrenFunc,
    buildChildrenArray, filepathTraceFunc, closeFolderFunc, fileUpload, sortFunc, moveExternal, moveWithin,
    loadAuth,
  } = props;
  return (
    <div className="user-list">
      {userList.map((user) => (
        <User
          forwardRef={user.ref}
          parseIDToken={parseIDToken}
          fileList={user.filesWithChildren}
          userId={user.id}
          idToken={user.idToken}
          removeFunc={removeFunc}
          refreshFunc={refreshFunc}
          fileUpload={fileUpload}
          isChildFunc={isChildFunc}
          topLevelFolderList={user.topLevelFolders}
          looseFileList={user.looseFiles}
          fileTrees={user.folderTrees}
          openChildrenFunc={openChildrenFunc}
          filepathTraceFunc={filepathTraceFunc}
          openFolderList={user.openFolders}
          buildChildrenArray={buildChildrenArray}
          closeFolderFunc={closeFolderFunc}
          sortFunc={sortFunc}
          currentSort={user.sortedBy}
          moveWithin={moveWithin}
          loadAuth={loadAuth}
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
  filepathTraceFunc: PropTypes.func.isRequired,
  isChildFunc: PropTypes.func.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
  sortFunc: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  loadAuth: PropTypes.func.isRequired,
};
