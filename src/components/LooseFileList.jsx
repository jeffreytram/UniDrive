import React from 'react';
import PropTypes from 'prop-types';
import File from './File';
import './FileList.css';

export default function LooseFileList(props) {
  const {
<<<<<<< HEAD:src/components/FileList.jsx
    fileList, fileContainerStyles, userId, copyFunc, deleteFunc
=======
    fileList, fileContainerStyles, userId, copyFunc, openChildrenFunc, looseFileList,
>>>>>>> 876416f27092af4d1d8236855d29164489cb1936:src/components/LooseFileList.jsx
  } = props;

  return (
    <div className="file-list-container" style={fileContainerStyles}>
      {looseFileList.map((file) => (
        <File
          userId={userId}
          data={file}
          copyFunc={copyFunc}
<<<<<<< HEAD:src/components/FileList.jsx
          deleteFunc={deleteFunc}
=======
          childrenList={[]}
          fileList={fileList}
          displayed
          openChildrenFunc={openChildrenFunc}
>>>>>>> 876416f27092af4d1d8236855d29164489cb1936:src/components/LooseFileList.jsx
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
<<<<<<< HEAD:src/components/FileList.jsx
  deleteFunc: PropTypes.func.isRequired,
=======
  openChildrenFunc: PropTypes.func.isRequired,
  looseFileList: PropTypes.arrayOf(PropTypes.object).isRequired,
>>>>>>> 876416f27092af4d1d8236855d29164489cb1936:src/components/LooseFileList.jsx
};
