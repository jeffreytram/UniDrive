import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretSquareLeft, faCaretSquareRight, faUserPlus, faShareSquare, faStar, faHome,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import '../css/Sidebar.css';

export default function Sidebar({
  authorizeUser, filterFilesInAllAccounts, parseIDToken, userList,
}) {
  const [expand, setExpand] = useState(false);
  const [keepExpanded, setKeepExpanded] = useState(false);
  const body = document.getElementsByTagName('body')[0];

  const scrollToggle = (ref) => {
    userList.forEach((user) => {
      user.ref.current.style.display = 'none';
    });
    ref.current.style.display = 'block';
    window.scrollTo(0, ref.current.offsetTop - 100);
  };

  const toggleKeepExpanded = () => {
    const sidebarItem = document.getElementsByClassName('collapsible');
    Array.from(sidebarItem).forEach((item) => {
      if (keepExpanded) {
        item.classList.add('collapse');
        body.style.setProperty('--sidebar-width', '60px');
      } else {
        item.classList.remove('collapse');
        body.style.setProperty('--sidebar-width', '225px');
      }
    });
    setKeepExpanded(!keepExpanded);
  };

  const setExpanded = () => {
    const sidebarItem = document.getElementsByClassName('collapsible');
    Array.from(sidebarItem).forEach((item) => {
      if (!expand) {
        item.classList.remove('collapse');
        body.style.setProperty('--sidebar-width', '225px');
        setExpand(true);
      }
    });
  };

  const setCollapsed = () => {
    const sidebarItem = document.getElementsByClassName('collapsible');
    Array.from(sidebarItem).forEach((item) => {
      if (expand) {
        item.classList.add('collapse');
        body.style.setProperty('--sidebar-width', '60px');
        setExpand(false);
      }
    });
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
      query += ' and starred=true';
    }
    filterFilesInAllAccounts(query);
  };

  return (
    <div className="sidebar" onMouseEnter={() => (!keepExpanded) && setExpanded()} onMouseLeave={() => (!keepExpanded) && setCollapsed()}>
      <div>
        <button type="button" className="sidebar-add-button" id="signin-btn" onClick={() => authorizeUser()}>
          <FontAwesomeIcon icon={faUserPlus} size="lg" title="Add an Account" />
          {expand ? ' Add Account' : ''}
        </button>
        <div className="sidebar-item collapsible collapse selected" onClick={(event) => handleClick(event.target, '')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faHome} size="lg" title="All Files" />
          {expand ? ' All Files' : ''}
        </div>
        <div className="sidebar-item collapsible collapse" onClick={(event) => handleClick(event.target, 'my drives')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faGoogleDrive} size="lg" title="My Drive Files" />
          {expand ? ' My Drive Files' : ''}
        </div>
        <div className="sidebar-item collapsible collapse" onClick={(event) => handleClick(event.target, 'shared')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faShareSquare} size="lg" title="Shared" />
          {expand ? ' Shared' : ''}
        </div>
        <div className="sidebar-item collapsible collapse" onClick={(event) => handleClick(event.target, 'starred')}>
          <FontAwesomeIcon className="sidebar-icon" icon={faStar} size="lg" title="Starred" />
          {expand ? ' Starred' : ''}
        </div>

        <div className="sidebar-user-container">
          { userList.map((user) => {
            const { name, picture } = parseIDToken(user.idToken);
            const { ref } = user;
            return (
              <div className="sidebar-user collapsible collapse" key={user.id} onClick={() => scrollToggle(ref)}>
                <img className="sidebar-picture" src={picture} alt="Account profile" />
                {expand ? ` ${name}` : ''}
              </div>
            );
          })}
        </div>
      </div>
      <div className="collapse-container collapsible collapse">
        <button type="button" className="collapse-button" onClick={() => toggleKeepExpanded()}>
          <FontAwesomeIcon icon={keepExpanded ? faCaretSquareLeft : faCaretSquareRight} size="lg" title={keepExpanded ? 'Collapse' : 'Keep expanded'} />
        </button>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  authorizeUser: PropTypes.func.isRequired,
  filterFilesInAllAccounts: PropTypes.func.isRequired,
  parseIDToken: PropTypes.func.isRequired,
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
