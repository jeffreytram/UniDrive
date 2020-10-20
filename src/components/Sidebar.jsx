import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShareSquare, faStar,
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

export default function Sidebar(props) {
  const { userList, parseIDToken } = props;
  return (
    <div className="sidebar">
      <div>
        <FontAwesomeIcon style={{ color: 'var(--subtle2)' }} icon={faShareSquare} size="2x" />
        Shared with me
      </div>
      <div>
        <FontAwesomeIcon style={{ color: 'var(--subtle2)' }} icon={faStar} size="2x" />
        Starred
      </div>
      <div className="sidebar-user-container">
        { userList.map((user) => {
          const { name, picture } = parseIDToken(user.idToken);
          return (
            <div className="sidebar-user">
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
