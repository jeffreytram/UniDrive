import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({
  children, filterFilesInAllAccounts, parseIDToken, userList,
}) {
  return (
    <div>
      <Header />
      <Sidebar
        userList={userList}
        parseIDToken={parseIDToken}
        filterFilesInAllAccounts={filterFilesInAllAccounts}
      />
      {children}
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  filterFilesInAllAccounts: PropTypes.func.isRequired,
  parseIDToken: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
