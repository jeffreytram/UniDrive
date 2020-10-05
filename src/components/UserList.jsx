import React from 'react';
import PropTypes from 'prop-types';
import User from './User';
import './UserList.css';

export default function UserList(props) {
  const {
<<<<<<< HEAD
    userList, parseIDToken, removeFunc, refreshFunc, copyFunc, deleteFunc
=======
    userList, parseIDToken, removeFunc, refreshFunc, copyFunc, isChildFunc, openChildrenFunc,
     buildChildrenArray, filepathTraceFunc, closeFolderFunc
>>>>>>> 876416f27092af4d1d8236855d29164489cb1936
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
<<<<<<< HEAD
          deleteFunc={deleteFunc}
=======
          isChildFunc={isChildFunc}
          topLevelFolderList={user.topLevelFolders}
          looseFileList={user.looseFiles}
          fileTrees={user.folderTrees}
          openChildrenFunc={openChildrenFunc}
          filepathTraceFunc={filepathTraceFunc}
          openFolderList={user.openFolders}
          buildChildrenArray = {buildChildrenArray}
          closeFolderFunc = {closeFolderFunc}
>>>>>>> 876416f27092af4d1d8236855d29164489cb1936
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
  copyFunc: PropTypes.func.isRequired,
<<<<<<< HEAD
  deleteFunc: PropTypes.func.isRequired,
=======
  filepathTraceFunc: PropTypes.func.isRequired,
  isChildFunc: PropTypes.func.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  buildChildrenArray: PropTypes.func.isRequired,
  
>>>>>>> 876416f27092af4d1d8236855d29164489cb1936
};
