import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './File.css';


class File extends Component {
  constructor() {
    super();
    this.state = {
    };
  }



  

/* Props contains: Name, Link, Image */
//export default function File(props) {
render() {
  const { userId, data, copyFunc, fId, isChildFunc, parentIdList, parentFiles, sortedFolders, fileList, displayed, toggleChildrenFunc, fileObj } = this.props;
  const {
    id, webViewLink, iconLink, name, mimeType, parents
  } = data;
if (displayed) {
    if (mimeType !== 'application/vnd.google-apps.folder') {
      //if file
        return (
          <div className="file-container">
            <div className="file-image-container">
              <a href={webViewLink} target="_blank">
                <img className="file-img" src={iconLink} alt="File icon" />
              </a>
            </div>
            <div className="file-name">
              <a href={webViewLink} target="_blank">{name} </a>
            </div>
            <button type="button" className="copy-btn" onClick={() => copyFunc(userId, id)}>Copy</button>
          </div>
        );
      } else {
      //if folder
      return (
        <div className="file-container">
          <div className="file-image-container">
              <img className="file-img" src={iconLink} alt="File icon"/>
          </div>
          <div className="file-name">
            <a href={webViewLink}  target="_blank">{name}</a>
          </div>
          <button type="button" className="copy-btn" onClick={() => toggleChildrenFunc(userId, fileObj, fId)}>Open</button>
        </div>
      );
      }

      } else {return null}
  }
}




File.propTypes = {
  userId: PropTypes.number.isRequired,
  data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])).isRequired,
  copyFunc: PropTypes.func.isRequired,
  folderId: PropTypes.number.isRequired,
  isChildFunc: PropTypes.func.isRequired,
  parentIdList: PropTypes.arrayOf(PropTypes.string).isRequired,
  parentFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortedFolders: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  displayed: PropTypes.bool.isRequired,
  toggleChildrenFunc: PropTypes.func.isRequired,
  fileObj: PropTypes.arrayOf(PropTypes.object),
};

export default File;