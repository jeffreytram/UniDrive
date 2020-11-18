import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretSquareLeft, faCaretSquareRight, faUserPlus, faShareSquare, faStar, faHome, faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { parseIDToken } from '../logic/auth';
import '../css/Sidebar.css';

export default function Sidebar({
  authorizeUser, filterFilesInAllAccounts, userList, removeAllAccounts,
  starFilter,
}) {
  const body = document.getElementsByTagName('body')[0];
  const style = getComputedStyle(body);
  const initialState = (style.getPropertyValue('--sidebar-width') === '225px');
  const [expand, setExpand] = useState(initialState);

  const scrollToggle = (ref) => {
    userList.forEach((user) => {
      user.ref.current.style.display = 'none';
    });
    ref.current.style.display = 'block';
    window.scrollTo(0, ref.current.offsetTop - 100);
  };

  const toggleExpand = () => {
    const sidebarItem = document.getElementsByClassName('collapsible');
    Array.from(sidebarItem).forEach((item) => {
      if (expand) {
        item.classList.add('collapse');
        body.style.setProperty('--sidebar-width', '60px');
      } else {
        item.classList.remove('collapse');
        body.style.setProperty('--sidebar-width', '225px');
      }
    });
    setExpand(!expand);
  };

  const handleClick = (target, filter) => {
    const selected = document.getElementsByClassName('selected')[0];
    selected.classList.remove('selected');
    target.classList.add('selected');

    let query = 'trashed = false';

    if (filter === 'my drives') {
      query += ' and "me" in owners';
    } else if (filter === 'shared') {
      query += ' and not "me" in owners';
    } else if (filter === 'starred') {
      starFilter();
      return;
    }
    filterFilesInAllAccounts(query);
  };
  const sidebarClassName = (expand) ? 'collapsible' : 'collapsible collapse';
  return (
    <div className="sidebar">
      <div>
        <button type="button" className="sidebar-add-button" id="signin-btn" onClick={() => authorizeUser()}>
          <FontAwesomeIcon icon={faUserPlus} size="lg" title="Add an Account" />
          {expand ? ' Add Account' : ''}
        </button>
        <button type="button" className="sidebar-remove-button" id="remove-btn" onClick={() => removeAllAccounts()}>
          <FontAwesomeIcon icon={faUserSlash} size="lg" title="Remove All Accounts" />
          {expand ? ' Remove All Accounts' : ''}
        </button>
        <div className={`sidebar-item ${sidebarClassName} selected`} onClick={(event) => handleClick(event.target, '')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faHome} size="lg" title="All Files" />
          {expand ? ' All Files' : ''}
        </div>
        <div className={`sidebar-item ${sidebarClassName}`} onClick={(event) => handleClick(event.target, 'my drives')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faGoogleDrive} size="lg" title="My Drive Files" />
          {expand ? ' My Drive Files' : ''}
        </div>
        <div className={`sidebar-item ${sidebarClassName}`} onClick={(event) => handleClick(event.target, 'shared')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faShareSquare} size="lg" title="Shared" />
          {expand ? ' Shared' : ''}
        </div>
        <div className={`sidebar-item ${sidebarClassName}`} onClick={(event) => handleClick(event.target, 'starred')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faStar} size="lg" title="Starred" />
          {expand ? ' Starred' : ''}
        </div>

        <div className="sidebar-user-container">
          { userList.map((user) => {
            const { name, picture } = parseIDToken(user.idToken);
            const { ref } = user;
            return (
              <div className={`sidebar-user ${sidebarClassName}`} key={user.id} onClick={() => scrollToggle(ref)}>
                <img className="sidebar-picture" src={picture} alt="Account profile" />
                {expand ? ` ${name}` : ''}
              </div>
            );
          })}
        </div>
      </div>
      <div className="collapse-container collapsible">
        <button type="button" className="collapse-button" onClick={() => toggleExpand()}>
          <FontAwesomeIcon icon={expand ? faCaretSquareLeft : faCaretSquareRight} size="lg" title={expand ? 'Collapse' : 'Expand'} />
        </button>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  authorizeUser: PropTypes.func.isRequired,
  filterFilesInAllAccounts: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeAllAccounts: PropTypes.func.isRequired,
};
