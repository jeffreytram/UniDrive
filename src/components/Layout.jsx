import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';

export default function Layout({
  authorizeUser, children, filterFilesInAllAccounts, parseIDToken, userList, removeAllAccounts,
}) {
  return (
    <div>
      <Sidebar
        authorizeUser={authorizeUser}
        filterFilesInAllAccounts={filterFilesInAllAccounts}
        parseIDToken={parseIDToken}
        userList={userList}
        removeAllAccounts = {removeAllAccounts}
      />
      {children}
    </div>
  );
}

Layout.propTypes = {
  authorizeUser: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  filterFilesInAllAccounts: PropTypes.func.isRequired,
  parseIDToken: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAllAccountsAccounts: PropTypes.func.isRequired,

};
