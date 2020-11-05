import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareSquare, faStar, faHome } from '@fortawesome/free-solid-svg-icons';
import { faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import '../css/Sidebar.css';

export default function Sidebar({ userList, parseIDToken, filterFilesInAllAccounts }) {
  const scrollToggle = (ref) => {
    userList.forEach((user) => {
      user.ref.current.style.display = 'none';
    });
    ref.current.style.display = 'block';
    window.scrollTo(0, ref.current.offsetTop - 100);
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
    <div className="sidebar">
      <div className="sidebar-item selected" onClick={(event) => handleClick(event.target, '')}>
        <FontAwesomeIcon style={{ color: 'var(--subtle2)' }} icon={faHome} size="2x" />
        All Files
      </div>
      <div className="sidebar-item" onClick={(event) => handleClick(event.target, 'my drives')}>
        <FontAwesomeIcon style={{ color: 'var(--subtle2)' }} icon={faGoogleDrive} size="2x" />
        My Drive Files
      </div>
      <div className="sidebar-item" onClick={(event) => handleClick(event.target, 'shared')}>
        <FontAwesomeIcon style={{ color: 'var(--subtle2)' }} icon={faShareSquare} size="2x" />
        Shared
      </div>
      <div className="sidebar-item" onClick={(event) => handleClick(event.target, 'starred')}>
        <FontAwesomeIcon style={{ color: 'var(--subtle2)' }} icon={faStar} size="2x" />
        Starred
      </div>
      <div className="sidebar-user-container">
        { userList.map((user) => {
          const { name, picture } = parseIDToken(user.idToken);
          const { ref } = user;
          return (
            <div className="sidebar-user" onClick={() => scrollToggle(ref)}>
              <img className="sidebar-picture" src={picture} alt="Account profile" />
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
  parseIDToken: PropTypes.func.isRequired,
};
