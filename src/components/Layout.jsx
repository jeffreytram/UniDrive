import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({
  children, userList, parseIDToken, refs, filterFilesInAllAccounts
}) {
  return (
    <div>
      <Header />
      <Sidebar
        userList={userList}
        parseIDToken={parseIDToken}
        refs={refs}
        filterFilesInAllAccounts={filterFilesInAllAccounts}
      />
      {children}
    </div>
  );
}
