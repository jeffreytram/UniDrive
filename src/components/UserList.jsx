import React from 'react';
import PropTypes from 'prop-types';
import User from './User';
import './UserList.css';

export default function UserList(props) {
  const {
    userList, parseIDToken, removeFunc, refreshFunc, copyFunc, isChildFunc, toggleChildrenFunc
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
          parentIdList={user.parentIds}
          parentFiles={user.parentFiles}
          sortedFolders={user.sortedFolders}
          toggleChildrenFunc={toggleChildrenFunc}
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
  isChildFunc: PropTypes.func.isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
};
