import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function LooseFileList(props) {
  const {
    fileList, fileContainerStyles, userId, copyFunc, openChildrenFunc, looseFileList
  } = props;
  
  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {looseFileList.map((file) => (
        <File
          userId={userId}
          data={file}
          copyFunc={copyFunc}
          childrenList={[]}
          fileList = {fileList}
          displayed = {true}
          openChildrenFunc={openChildrenFunc}
        />
      ))}
    </div>
  );
}

LooseFileList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileContainerStyles: PropTypes.objectOf(PropTypes.string).isRequired,
  userId: PropTypes.number.isRequired,
  copyFunc: PropTypes.func.isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
