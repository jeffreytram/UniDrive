import React from 'react';
import PropTypes from 'prop-types';
import User from './User';
import '../css/UserList.css';

export default function UserList(props) {
  const {
    userList, parseIDToken, removeFunc, refreshFunc,
    fileUpload, sortFunc, moveExternal, moveWithin,
    loadAuth, openFolder, closePath, updatePath
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
          fileTrees={user.folderTrees}
          topLevelFolderList={user.topLevelFolders}
          looseFileList={user.looseFiles}
          openFolderList={user.openFolders}
          sortFunc={sortFunc}
          currentSort={user.sortedBy}
          moveWithin={moveWithin}
          loadAuth={loadAuth}
          moveExternal={moveExternal}
          openFolder={openFolder}
          closePath={closePath}
          updatePath={updatePath}
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
