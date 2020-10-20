import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShareSquare, faStar,
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

export default function Sidebar() {
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
    </div>
  );
}
