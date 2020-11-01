import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShareSquare, faStar, faHome,
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

class Sidebar extends Component {
  scrollToggle = (ref) => {
    const { userList } = this.props;
    userList.forEach((user) => {
      user.ref.current.style.display = 'none';
    });
    ref.current.style.display = 'block';
    window.scrollTo(0, ref.current.offsetTop - 100);
  }

  render() {
    const { userList, parseIDToken } = this.props;
    return (
      <div className="sidebar">
        <div>
          <FontAwesomeIcon style={{ color: 'var(--subtle2)' }} icon={faHome} size="2x" />
          My Drives
        </div>
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
            const { ref } = user;// refs[i];
            return (
              <div className="sidebar-user" onClick={() => this.scrollToggle(ref)}>
                <img className="sidebar-picture" src={picture} alt="Account profile" />
                {name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  userList: PropTypes.arrayOf(PropTypes.object).isRequired,
  parseIDToken: PropTypes.func.isRequired,
};

export default Sidebar;
