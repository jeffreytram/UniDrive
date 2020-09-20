import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function UserList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc,
  } = props;
  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {fileList.map((file) => (
        <File
          userId={userId}
          data={file}
          copyFunc={copyFunc}
        />
      ))}
    </div>
  );
}

UserList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  copyFunc: PropTypes.func.isRequired,
};
