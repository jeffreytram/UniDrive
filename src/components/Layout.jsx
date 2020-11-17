import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';

export default function Layout({
  authorizeUser, children, filterFilesInAllAccounts, removeAllAccounts,
  starFilter, userList,
}) {
  return (
    <div>
      <Sidebar
        authorizeUser={authorizeUser}
        filterFilesInAllAccounts={filterFilesInAllAccounts}
        removeAllAccounts={removeAllAccounts}
        starFilter={starFilter}
        userList={userList}
      />
      {children}
    </div>
  );
}

Layout.propTypes = {
  authorizeUser: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  filterFilesInAllAccounts: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAllAccounts: PropTypes.func.isRequired,
};
