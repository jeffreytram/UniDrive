import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function UserList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, isChildFunc, toggleChildrenFunc, looseFileList
  } = props;
  
  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {looseFileList.map((file) => (
        <File
          userId={userId}
          data={file}
          copyFunc={copyFunc}
          childrenList={[]}
          isChildFunc={isChildFunc}
          fileList = {fileList}
          displayed = {true}
          toggleChildrenFunc={toggleChildrenFunc}
        />
      ))}
    </div>
  );
}

UserList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  copyFunc: PropTypes.func.isRequired,
  isChildFunc: PropTypes.func.isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
