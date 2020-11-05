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
      children, closePath, displayed, loadAuth, moveExternal, moveWithin,
      oId, openFolder, path, shareFile, updatePath, userId,
    } = this.props;

    return (
      <div className="open-folder">
        <div className="file-path-container">
          <button type="button" className="copy-btn" onClick={() => closePath(oId, userId)}>Close</button>
          {path.map((folder, i) => (
            <FilePath
              key={folder.id}
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
              key={file.id}
              userId={userId}
              data={file}
              oId={oId}
              displayed={displayed}
              moveExternal={moveExternal}
              shareFile={shareFile}
              moveWithin={moveWithin}
              loadAuth={loadAuth}
              openFolder={openFolder}
            />
          ))}
        </div>
      </div>

    );
  }
}

OpenFolder.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  closePath: PropTypes.func.isRequired,
  displayed: PropTypes.bool.isRequired,
  loadAuth: PropTypes.func.isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  oId: PropTypes.number.isRequired,
  openFolder: PropTypes.func.isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  shareFile: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default OpenFolder;
