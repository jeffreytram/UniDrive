import React from 'react';
import PropTypes from 'prop-types';
import User from './User';
import './UserList.css';

export default function UserList(props) {
  const {
    userList, parseIDToken, removeFunc, refreshFunc, copyFunc,
  } = props;
  return (
    <div className="user-list">
      {userList.map((user) => (
        <User
          infoData={user.idToken}
          parseIDToken={parseIDToken}
          fileList={user.files}
          userId={user.id}
          removeFunc={removeFunc}
          refreshFunc={refreshFunc}
          copyFunc={copyFunc}
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
};
