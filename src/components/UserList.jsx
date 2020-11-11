import React from 'react';
import PropTypes from 'prop-types';
import User from './User';
import '../css/UserList.css';

export default function UserList(props) {
  const {
    closePath, fileUpload, loadAuth, moveExternal, moveWithin, openFolder,
    parseIDToken, refreshFunc, removeFunc, sortFunc, updatePath, userList, filterFunc
  } = props;
  return (
    <div className="user-list">
      {userList.map((user) => (
        <User
          key={user.id}
          forwardRef={user.ref}
          parseIDToken={parseIDToken}
          userId={user.id}
          idToken={user.idToken}
          removeFunc={removeFunc}
          refreshFunc={refreshFunc}
          fileUpload={fileUpload}
          topLevelFolderList={user.topLevelFolders}
          looseFileList={user.looseFiles}
          openFolderList={user.openFolders}
          sortFunc={sortFunc}
          filterFunc={filterFunc}
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
  closePath: PropTypes.func.isRequired,
  fileUpload: PropTypes.func.isRequired,
  loadAuth: PropTypes.func.isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  openFolder: PropTypes.func.isRequired,
  parseIDToken: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  removeFunc: PropTypes.func.isRequired,
  sortFunc: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
