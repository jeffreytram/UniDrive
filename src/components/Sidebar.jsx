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

  const selectedElementList = document.getElementsByClassName('selected');
  const initilaSelected = (selectedElementList.length === 0) ? 'all-files' : selectedElementList[0].id;
  const [selected, setSelected] = useState(initilaSelected);

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

  const handleClick = (target) => {
    setSelected(target);
    let query = 'trashed = false';

    if (target === 'my-drive') {
      query += ' and "me" in owners';
    } else if (target === 'shared') {
      query += ' and not "me" in owners';
    } else if (target === 'starred') {
      starFilter();
      return;
    }
    filterFilesInAllAccounts(query);
  };
  const sidebarClassName = (expand) ? 'collapsible' : 'collapsible collapse';
  return (
    <div className={(expand) ? 'sidebar' : 'sidebar collapse'}>
      <div>
        <button type="button" className="sidebar-add-button" id="signin-btn" onClick={() => authorizeUser()}>
          <FontAwesomeIcon icon={faUserPlus} size="lg" title="Add an Account" />
          {expand ? ' Add Account' : ''}
        </button>
        <button type="button" className="sidebar-remove-button" id="remove-btn" onClick={() => removeAllAccounts()}>
          <FontAwesomeIcon icon={faUserSlash} size="lg" title="Remove All Accounts" />
          {expand ? ' Remove All Accounts' : ''}
        </button>
        <button type="button" className={`sidebar-item ${sidebarClassName} ${(selected === 'all-files') ? 'selected' : ''}`} id="all-files" onClick={() => handleClick('all-files')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faHome} size="lg" title="All Files" />
          {expand ? ' All Files' : ''}
        </button>
        <button type="button" className={`sidebar-item ${sidebarClassName} ${(selected === 'my-drive') ? 'selected' : ''}`} id="my-drive" onClick={() => handleClick('my-drive')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faGoogleDrive} size="lg" title="My Drive Files" />
          {expand ? ' My Drive Files' : ''}
        </button>
        <button type="button" className={`sidebar-item ${sidebarClassName} ${(selected === 'shared') ? 'selected' : ''}`} id="shared" onClick={() => handleClick('shared')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faShareSquare} size="lg" title="Shared" />
          {expand ? ' Shared' : ''}
        </button>
        <button type="button" className={`sidebar-item ${sidebarClassName} ${(selected === 'starred') ? 'selected' : ''}`} id="starred" onClick={() => handleClick('starred')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faStar} size="lg" title="Starred" />
          {expand ? ' Starred' : ''}
        </button>

        <div className="sidebar-user-container">
          { userList.map((user) => {
            const { name, picture } = parseIDToken(user.idToken);
            const { ref } = user;
            return (
              <button type="button" className={`sidebar-user ${sidebarClassName}`} key={user.id} onClick={() => scrollToggle(ref)}>
                <img className="sidebar-picture" src={picture} alt="Account profile" />
                {expand ? ` ${name}` : ''}
              </button>
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
