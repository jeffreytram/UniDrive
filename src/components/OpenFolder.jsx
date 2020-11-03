import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilePath from './FilePath';
import '../css/OpenFolder.css';
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
      path, children, oId, userId, moveExternal, moveWithin,
      shareFile, loadAuth, refreshFunc, email,
      openFolder, closePath, updatePath
    } = this.props;

    return (
      <div className="open-folder">
        <div className="file-path-container">
          <button type="button" className="copy-btn" onClick={() => closePath(oId, userId)}>Close</button>
          {path.map((folder, i) => (
            <FilePath
              userId={userId}
              oId={oId}
              pIndex={i}
              folder={folder}
              updatePath={updatePath}
            />
          ))}
        </div>

        <div className="current-folder">
          {children.map((file) => (
            <File
              userId={userId}
              data={file}
              oId={oId}
              displayed
              moveExternal={moveExternal}
              shareFile={shareFile}
              moveWithin={moveWithin}
              loadAuth={loadAuth}
              refreshFunc={refreshFunc}
              email={email}
              openFolder={openFolder}
            />
          ))}
        </div>
      </div>

    );
  }
}

OpenFolder.propTypes = {
  userId: PropTypes.number.isRequired,
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  openChildrenFunc: PropTypes.func.isRequired,
  closeFolderFunc: PropTypes.func.isRequired,
  filepathTraceFunc: PropTypes.func.isRequired,
  fileObj: PropTypes.arrayOf(PropTypes.object).isRequired,
  filePath: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default OpenFolder;
