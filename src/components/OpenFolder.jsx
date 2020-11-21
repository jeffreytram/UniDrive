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

  render() {
    const {
      children, closePath, email, moveExternal, moveWithin,
      oId, openFolder, path, refreshFunc, shareFile, updatePath, userId,
    } = this.props;

    const folderList = [];
    const fileList = [];
    children.forEach((file) => {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        folderList.push(file);
      } else {
        fileList.push(file);
      }
    });

    return (
      <div className="open-folder">
        <div className="file-path-container">
          <button type="button" className="close-folder-btn" onClick={() => closePath(oId, userId)}>Close</button>
          {path.map((folder, i) => (
            <FilePath
              key={folder.id}
              email={email}
              userId={userId}
              oId={oId}
              pIndex={i}
              folder={folder}
              updatePath={updatePath}
              openFolder={openFolder}
              refreshFunc={refreshFunc}
              shareFile={shareFile}
              moveWithin={moveWithin}
            />
          ))}
        </div>
        {folderList.length > 0 && (
          <div className="open-folder-folder-list">
            {folderList.map((file) => (
              <File
                key={file.id}
                data={file}
                email={email}
                moveExternal={moveExternal}
                moveWithin={moveWithin}
                oId={oId}
                openFolder={openFolder}
                refreshFunc={refreshFunc}
                shareFile={shareFile}
                userId={userId}
              />
            ))}
          </div>
        )}
        <div className="open-folder-file-list">
          {fileList.map((file) => (
            <File
              key={file.id}
              data={file}
              email={email}
              moveExternal={moveExternal}
              moveWithin={moveWithin}
              oId={oId}
              openFolder={openFolder}
              refreshFunc={refreshFunc}
              shareFile={shareFile}
              userId={userId}
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
  email: PropTypes.string.isRequired,
  moveExternal: PropTypes.func.isRequired,
  moveWithin: PropTypes.func.isRequired,
  oId: PropTypes.number.isRequired,
  openFolder: PropTypes.func.isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  shareFile: PropTypes.func.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  updatePath: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default OpenFolder;
