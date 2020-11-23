import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import '../css/FileList.css';

export default function LooseFileList(props) {
  const {
    email, looseFileList, moveExternal, moveWithin, refreshFunc,
    shareFile, userId,
  } = props;

  return (
    <div className="file-list-container">
      {looseFileList.map((file) => (
        <File
          key={file.id}
          userId={userId}
          data={file}
          email={email}
          moveExternal={moveExternal}
          shareFile={shareFile}
          moveWithin={moveWithin}
          refreshFunc={refreshFunc}
          oId={-1}
        />
      ))}
    </div>
  );
}

LooseFileList.propTypes = {
  email: PropTypes.string.isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  shareFile: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
