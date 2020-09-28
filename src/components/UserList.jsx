import React from 'react';
import PropTypes from 'prop-types';
import User from './User';
import './UserList.css';

export default function UserList(props) {
  const {
    userList, parseIDToken, removeFunc, refreshFunc, copyFunc, isChildFunc, toggleChildrenFunc,
     buildChildrenArray, filepathTraceFunc
  } = props;
  return (
    <div className="user-list">
      {userList.map((user) => (
        <User
          infoData={user.idToken}
          parseIDToken={parseIDToken}
          fileList={user.filesWithChildren}
          userId={user.id}
          removeFunc={removeFunc}
          refreshFunc={refreshFunc}
          copyFunc={copyFunc}
          isChildFunc={isChildFunc}
          topLevelFolderList={user.topLevelFolders}
          looseFileList={user.looseFiles}
          fileTrees={user.folderTrees}
          toggleChildrenFunc={toggleChildrenFunc}
          filepathTraceFunc={filepathTraceFunc}
          openFolderList={user.openFolders}
          buildChildrenArray = {buildChildrenArray}
        />
      ))}
    </div>
  );
}

UserList.propTypes = {
  userList: PropTypes.objectOf([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
  parseIDToken: PropTypes.func.isRequired,
  removeFunc: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  copyFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  isChildFunc: PropTypes.func.isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
  
};
