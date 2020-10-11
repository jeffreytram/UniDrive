import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilePath from './FilePath';
import './OpenFolder.css';
import File from './File';

class OpenFolder extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  /* Props contains: Name, Link, Image */
  // export default function File(props) {
  render() {
    const {
      userId, copyFunc, deleteFunc, fileList, openChildrenFunc,
      fileObj, filePath, filepathTraceFunc, closeFolderFunc, moveExternal
    } = this.props;

    return (
      <div className="open-folder">
        <div className="file-path-container">
          <button type="button" className="copy-btn" onClick={() => closeFolderFunc(fileObj, userId)}>Close</button>
          {fileObj.filepath.map((filep) => (
            <FilePath
              filepath={filep}
              userId={userId}
              filepathArray={filePath}
              filepathTraceFunc={filepathTraceFunc}
            />
          ))}

        </div>

        <div className="current-folder">
          {fileObj.children.map((file) => (
            <File
              userId={userId}
              data={file}
              copyFunc={copyFunc}
              deleteFunc={deleteFunc}
              fileList={fileList}
              displayed
              openChildrenFunc={openChildrenFunc}
              moveExternal={moveExternal}
              fileObj={file}
            />
          ))}

        </div>
      </div>

    );
  }
}

OpenFolder.propTypes = {
  userId: PropTypes.number.isRequired,
  copyFunc: PropTypes.func.isRequired,
  deleteFunc: PropTypes.func.isRequired,
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  fileObj: PropTypes.arrayOf(PropTypes.object).isRequired,
  filePath: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default OpenFolder;
