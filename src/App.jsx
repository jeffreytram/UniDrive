import React, { Component } from 'react';
import UserList from './components/UserList';
import RequestProgress from './components/RequestProgress';
import Layout from './components/Layout';
import Header from './components/Header';
import Welcome from './components/Welcome';
import { config } from './config';
import './App.css';

const SCOPE = 'profile email openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
const discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key;
const CLIENT_ID = config.web.client_id;
const ready = true;
let userId = 1;

class App extends Component {
  constructor() {
    super();
    this.state = {
      userList: [],
      uploadRequests: [],
      lastRefreshTime: Date().substring(0, 21),
      filterQuery: 'trashed = false',
      searchQuery: 'name contains ""',
    };
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.onload = this.handleClientLoad;
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
    this.interval = setInterval(() => {
      this.refreshAllFunction();
    }, 300000);
  }

  handleClientLoad = () => {
    window.gapi.load('client:auth');
  }

  /**
   * Signs a new user into Google, and then begins the process of storing all of their information
   * Returns an idToken, an AccessToken, and a Code, all unique to the user in a Response object
   */
  authorizeUser = () => {
    window.gapi.load('client:auth', () => {
      window.gapi.auth2.authorize({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        responseType: 'id_token permission code',
        prompt: 'select_account',
        discoveryDocs: [discoveryUrl, 'https:googleapis.com/discovery/v1/apis/profile/v1/rest'],
      }, (response) => {
        if (response.error) {
          console.log(response.error);
          console.log('authorization error');
          return;
        }
        const accessToken = response.access_token;
        const idToken = response.id_token;
        const { code } = response;
        this.signInFunction(accessToken, idToken, code);
      });
    });
  }

  /**
   * Handles user sign in by storing all the information gained from the
   * authrizeUser() function above
   * @param {Object} accessToken the accessToken granted to the user by gapi.client.authorize()
   * @param {Object} idToken the accessToken granted to the user by gapi.client.authorize()
    * @param {Object} code the code granted to the user by gapi.client.authorize()
   */
  signInFunction = (accessToken, idToken, code) => {
    const userInfo = this.parseIDToken(idToken);
    const { email } = userInfo;
    const isDup = this.addUser(accessToken, idToken, code);
    if (isDup) {
      return;
    }
    const { userList } = this.state;
    const newUserIndex = userList.length - 1;
    this.updateFiles(newUserIndex, email);
  }

  /**
   *  Handles user sign out.
   *  Removes the specified user from the userList array, then updates the State
   * @param {number} id attribute of the specific User to be removed in the UserList array
   */
  signOutFunction = (id) => {
    if (ready) {
      if (window.confirm('Are you sure you want to remove this account?')) {
        this.setState((prevState) => {
          const newUserList = prevState.userList.filter((user) => user.id !== id);
          return {
            userList: newUserList,
          };
        });
      }
    }
  }

  /**
   * Adds a new user to the list
   * @param {Object} accessToken the accessToken granted to the user by gapi.client.authorize()
   * @param {Object} idToken the accessToken granted to the user by gapi.client.authorize()
   * @param {Object} code the code granted to the user by gapi.client.authorize()
   */
  addUser = (accessToken, idToken, code) => {
    const { email } = this.parseIDToken(idToken);
    const { userList } = this.state;
    const isDup = this.isDuplicateUser(email, userList);
    if (!isDup) {
      this.setState((prevState) => ({
        userList: [...prevState.userList, {
          id: userId,
          accessToken,
          idToken,
          code,
          files: [],
          folders: {},
          topLevelFolders: [],
          filesWithChildren: [],
          looseFiles: [],
          openFolders: [],
          ref: React.createRef(),
          sortedBy: 'folder, createdTime desc',
          filteredBy: '',
        }],
      }));
      userId += 1;
    } else {
      console.log('Email is already in UserList');
    }
    return isDup;
  }

  isDuplicateUser = (email, userList) => {
    for (let i = 0; i < userList.length; i++) {
      if (email === this.parseIDToken(userList[i].idToken).email) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the files and stores them for the user at the given index
   * @param {Number} index index of the user in the userList to update
   * @param {Object} files the file object to store
   */
  updateFiles = (index, email) => {
    window.gapi.client.load('drive', 'v3').then(() => {
      window.gapi.auth2.authorize({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        prompt: 'none',
        login_hint: email,
        discoveryDocs: [discoveryUrl],
      }, (response) => {
        if (response.error) {
          console.log(response.error);
          console.log('authorization error');
          return;
        }
        this.getAndAssignFiles(index, email);
      });
    });
  }

  /**
   * Saves the input from the search bar. Will not return folders, only files
   * @param {string} searchInput from the searchbar.js
   */
  onFormSubmit = (searchInput) => {
    let searchQuery;
    if (searchInput === '') {
      searchQuery = `name contains '${searchInput}'`;
    } else {
      searchQuery = `mimeType != 'application/vnd.google-apps.folder' and name contains '${searchInput}'`;
    }
    this.setState({ searchQuery });
    this.refreshAllFunction();
  }

  filterFilesInAllAccounts = (filter) => {
    this.setFilterQuery(filter);
    const { userList } = this.state;
    userList.forEach((user, i) => {
      const { email } = this.parseIDToken(userList[i].idToken);
      this.updateFiles(i, email);
    });
  }

  setFilterQuery = (filter) => {
    this.setState((prevState) => ({
      filterQuery: filter,
    }));
  }

  /**
   * function which updates the filetypes displayed
   * @param {number} userID the id of the user
   * @param {Array} filterBy list of queries to filter by
   */
  changeFilterType = (userId, filterBy) => {
    this.setfilterType(userId, filterBy);
    this.refreshAllFunction();
  }

  /**
   * builds the Google search parameter to use in retrieving the files based upon which filters are selected (for filtering by file type)
   * @param {number} userID the id of the user
   * @param {Array} filterBy list of queries to filter by
   */
  setfilterType = (userId, filterBy) => {
    const { userList } = this.state;
    const index = this.getAccountIndex(userId);
    let fQuery = '';
    if (filterBy) fQuery = filterBy.join(' or ');
    userList[index].filteredBy = fQuery;
    this.setState((prevState) => ({
      userList,
    }));
  }

  // Relies on api call putting folders in front via orderBy
  /**
   *
   * @param {*} index userList index of user
   * @param {*} email email of user whose files are being requested
   */
  getAndAssignFiles = (index, email) => {
    const user = this.state.userList[index];
    this.retrieveAllFiles((results) => {
      const updatedList = this.state.userList;
      if (updatedList[index] === undefined) {
        return;
      }
      // Initialize so there are not double
      updatedList[index].folders = [];
      updatedList[index].topLevelFolders = [];
      updatedList[index].looseFiles = [];
      // Put folders in own data struct
      let i = -1;
      while (++i < results.length && results[i].mimeType === 'application/vnd.google-apps.folder') {
        // const newFile = results[i];
        // newFile.children = [];
        // updatedList[index].folders[results[i].id] = newFile;
        updatedList[index].folders[results[i].id] = {
          folder: results[i],
          children: [],
        };
      }
      /* Assign non-folder children to parent folder or lose-FileList if not children */
      for (let j = i; j < results.length; j++) {
        let np = true;
        if (results[j].hasOwnProperty('parents')) {
          for (let k = 0; k < results[j].parents.length; k++) {
            if (updatedList[index].folders.hasOwnProperty(results[j].parents[k])) {
              updatedList[index].folders[results[j].parents[k]].children.push(results[j]);
              np = false;
            }
          }
        }
        if (np) {
          updatedList[index].looseFiles.push(results[j]);
        }
      }
      /* Assign folder children to parent folder or top level folder list if not children */
      for (let j = 0; j < i; j++) {
        let np = true;
        if (results[j].hasOwnProperty('parents')) {
          for (let k = 0; k < results[j].parents.length; k++) {
            if (updatedList[index].folders.hasOwnProperty(results[j].parents[k])) {
              updatedList[index].folders[results[j].parents[k]].children.push(results[j]);
              np = false;
            }
          }
        }
        if (np) {
          updatedList[index].topLevelFolders.push(updatedList[index].folders[results[j].id]);
        }
      }
      /* Update file paths if a folder that was there is not anymore */
      const oldOpenFolders = updatedList[index].openFolders;
      for (let oId = 0; oId < updatedList[index].openFolders.length; oId++) {
        let pathIndex = 0;
        while (updatedList[index].openFolders[oId] && updatedList[index].openFolders[oId].path && pathIndex < updatedList[index].openFolders[oId].path.length) {
          const oldPath = updatedList[index].openFolders[oId].path;
          if (!this.state.userList[index].folders.hasOwnProperty(oldPath[pathIndex].id)) {
            if (pathIndex === 0) {
              updatedList[index].openFolders.splice(oId, 1);
            } else {
              // Cut off the rest of the folders
              updatedList[index].openFolders[oId].path.splice(pathIndex, (oldPath.length - 1) - pathIndex);
              updatedList[index].openFolders[oId].displayed = this.state.userList[index].folders[oldPath[pathIndex - 1].id].children;
            }
          } else {
            this.openFolder(updatedList[index].id, oId, oldOpenFolders[oId].path[oldOpenFolders[oId].path.length - 1], true);
          }
          pathIndex++;
        }
      }
      this.setState({ userList: updatedList });
    }, email, user);
  }

  /**
   *
   * @param {*} userId Id of the user that is having a file opened
   * @param {*} oId Index of the path in the openFolders array
   * @param {*} folder Folder being opened
   */
  openFolder = (userId, oId, folder, isUpdate) => {
    const index = this.getAccountIndex(userId);
    const updatedList = this.state.userList;
    const newOpenFolders = updatedList[index].openFolders;
    // If folder is topLevel, we will pass in null oId for these, create new open folder
    if (oId === null) {
      newOpenFolders.push({
        path: [folder],
        displayed: updatedList[index].folders[folder.id].children,
      });
      updatedList[index].openFolders = newOpenFolders;
      this.setState({ userList: updatedList });
    // If folder is not top level it is part of a filePath already
    } else if (!isUpdate) {
      newOpenFolders[oId].path.push(folder);
      newOpenFolders[oId].displayed = updatedList[index].folders[folder.id].children;
      updatedList[index].openFolders = newOpenFolders;
      this.setState({ userList: updatedList });
    } else {
      newOpenFolders[oId].displayed = updatedList[index].folders[folder.id].children;
      updatedList[index].openFolders = newOpenFolders;
      this.setState({ userList: updatedList });
    }
  }

  /**
   * removes the current entry in the openFolder List
   * @param {object} oId Index of entry in openFolders
   * @param {number} userId id of the user
   */
  closePath = (oId, userId) => {
    const index = this.getAccountIndex(userId);
    const newUserList = this.state.userList;
    newUserList[index].openFolders.splice(oId, 1);
    this.setState({ userList: newUserList });
  }

  /**
   *
   * @param {*} userId
   * @param {*} oId Index of entry in openFolders
   * @param {*} pId Index of folder in openFolders path array
   */
  updatePath = (userId, oId, pId) => {
    const index = this.getAccountIndex(userId);
    const updatedList = this.state.userList;
    const newOpenFolders = this.state.userList[index].openFolders[oId];
    newOpenFolders.path.splice(pId + 1, (newOpenFolders.path.length) - (pId + 1));
    newOpenFolders.displayed = this.state.userList[index].folders[newOpenFolders.path[pId].id].children;
    updatedList[index].openFolders[oId] = newOpenFolders;
    this.setState({ userList: updatedList });
  }

  /**
   * Retrieve all the files of user
   *
   * @param {Function} callback Function to call when the request is complete.
   * @param {String} email email of the user to keep automatically authenticating for each list request
   */
  retrieveAllFiles = (callback, email, user) => {
    const { filterQuery, searchQuery } = this.state;
    const fileTypeQuery = user.filteredBy;
    const query = `${filterQuery} and ${searchQuery} and (${fileTypeQuery})`;
    let res = [];
    const { sortedBy } = user;
    const retrievePageOfFiles = function (email, response, user) {
      window.gapi.client.load('drive', 'v3').then(() => {
        window.gapi.auth2.authorize({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPE,
          prompt: 'none',
          login_hint: email,
          discoveryDocs: [discoveryUrl],
        }, (r) => {
          res = res.concat(response.result.files);
          const { nextPageToken } = response.result;
          if (nextPageToken) {
            window.gapi.client.drive.files.list({
              pageToken: nextPageToken,
              fields: 'files(id, name, mimeType, starred, iconLink, shared, webViewLink, parents, driveId), nextPageToken',
              orderBy: sortedBy,
              q: query,
              pageSize: 1000,
              corpora: 'allDrives',
              includeItemsFromAllDrives: 'true',
              supportsAllDrives: 'true',
            }).then((response) => {
              retrievePageOfFiles(email, response, user);
            });
          } else {
            callback(res);
          }
        });
      });
    };

    window.gapi.client.load('drive', 'v3').then(() => {
      window.gapi.auth2.authorize({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        prompt: 'none',
        login_hint: email,
        discoveryDocs: [discoveryUrl],
      }, (response) => {
        if (response.error) {
          console.log(response.error);
          console.log('authorization error');
          return;
        }
        window.gapi.client.drive.files.list({
          fields: 'files(id, name, mimeType, starred, iconLink, shared, webViewLink, parents, driveId) , nextPageToken',
          orderBy: sortedBy,
          q: query,
          pageSize: 1000,
          corpora: 'allDrives',
          includeItemsFromAllDrives: 'true',
          supportsAllDrives: 'true',
        }).then((response) => {
          retrievePageOfFiles(email, response, user);
        });
      });
    });
  }

  /**
   * updates the sort Type when a new sort is selected
   * @param {number} userID the id of the user
   * @param {String} newSort the sort which has been selected
   */
  changeSortedBy = (userId, newSort) => {
    const index = this.getAccountIndex(userId);
    const { userList } = this.state;
    const { email } = this.parseIDToken(userList[index].idToken);
    userList[index].sortedBy = newSort;
    this.updateFiles(index, email);
  }

  /**
   * Decrypts the JSON string idToken in order to access the encrytped user information held within
   * @param {Object} token the idToken of the user
   */
  parseIDToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  /**
   * Moves a file from one folder to another
   * @param {*} userId id of the user which owns the files
   * @param {*} file file being moved
   * @param {*} newParentId Id of the folder to move to
   */
  moveWithin = (userId, file, newParentId) => {
    const userIndex = this.getAccountIndex(userId);
    const userToken = this.state.userList[userIndex].idToken;
    const { email } = this.parseIDToken(userToken);

    window.gapi.client.load('drive', 'v3').then(() => {
      window.gapi.auth2.authorize({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        prompt: 'none',
        login_hint: email,
        discoveryDocs: [discoveryUrl],
      }, (response) => {
        if (response.error) {
          console.log(response.error);
          console.log('authorization error');
        }
        if (file.parents === undefined) {
          return;
        }
        if (window.confirm('Warning: moving a file to root will unshare it with everybody it is currently shared with.')) {
          const preParents = file.parents.join(',');
          window.gapi.client.drive.files.update({
            fileId: file.id,
            addParents: newParentId,
            removeParents: preParents,
            fields: 'id, parents',
          }).then((response) => {
            if (response.error) {
              console.log(response.error);
            }
            console.log(response);
          });
        }
      });
    });
  }

  /**
   * Gets email for auth from a user Id
   * @param {*} userId
   */
  getEmailFromUserId(userId) {
    const userIndex = this.getAccountIndex(userId);
    const userToken = this.state.userList[userIndex].idToken;
    return this.parseIDToken(userToken).email;
  }

  moveExternal = (userId, fileId, newUserId) => {
    const email = this.getEmailFromUserId(userId);
    const newEmail = this.getEmailFromUserId(newUserId);
    window.gapi.client.load('drive', 'v3').then(() => {
      window.gapi.auth2.authorize({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        prompt: 'none',
        login_hint: email,
        discoveryDocs: [discoveryUrl],
      }, (response) => {
        const move_ex = new XMLHttpRequest();
        move_ex.open('POST', `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?moveToNewOwnersRoot=true&transferOwnership=true`, true);
        move_ex.setRequestHeader('Authorization', `Bearer ${response.access_token}`);
        move_ex.setRequestHeader('Accept', 'application/json');
        move_ex.setRequestHeader('Content-Type', 'application/json');
        move_ex.onreadystatechange = () => {
          if (move_ex.readyState === XMLHttpRequest.DONE && move_ex.status === 200) {
            console.log(move_ex.response);
          }
        };
        move_ex.send(JSON.stringify({
          type: 'user',
          role: 'owner',
          emailAddress: newEmail,
        }));
      });
    });
  }

  loadAuthorize = (id, func) => {
    const email = this.getEmailFromUserId(id);
    return (...args) => {
      window.gapi.client.load('drive', 'v3').then(() => {
        window.gapi.auth2.authorize({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPE,
          prompt: 'none',
          login_hint: email,
          discoveryDocs: [discoveryUrl],
        }, (response) => {
          if (response.error) {
            console.log(response.error);
          }
          func.call(this, ...args);
        });
      });
    };
  }

  /**
   * Refreshes all the files being displayed within an account
   * @param {Number} id the unique id granted to the user when placed within the userList
   *
   * if you delete a file and refresh very quickly, the file will still be shown due to Google being slow to mark as trashed, another refresh will clear it
   *
   */
  refreshFunction = (id) => {
    const index = this.getAccountIndex(id);
    const { userList } = this.state;
    const userInfo = this.parseIDToken(userList[index].idToken);
    const { email } = userInfo;
    this.updateFiles(index, email);
  }

  getAccountIndex = (id) => {
    const { userList } = this.state;
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Refreshes all of the accounts currently within the userList
   */
  refreshAllFunction = () => {
    const { userList } = this.state;
    for (let i = 0; i < userList.length; i++) {
      const userInfo = this.parseIDToken(userList[i].idToken);
      const { email } = userInfo;
      this.updateFiles(i, email);
    }
    const currentTimeDate = Date().substring(0, 21);
    this.setState((prevState) => ({
      lastRefreshTime: currentTimeDate,
    }));
  }

  /**
   * Clears requests
   */
  clearRequests = () => {
    this.setState({
      uploadRequests: [],
    });
  }

  /**
   * Uploads a file specified
   * @param {*} email User info for getting account
   * @param {*} fileUpl File to be uploaded
   */
  fileUpload = (idToken, file) => {
    const { email } = this.parseIDToken(idToken);
    window.gapi.client.load('drive', 'v3').then(() => {
      window.gapi.auth2.authorize({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        prompt: 'none',
        login_hint: email,
        discoveryDocs: [discoveryUrl],
      }, (response) => {
        if (response.error) {
          console.log(response.error);
          console.log('Auth error.');
        }
        const contentType = file.type || 'application/octet-stream';
        const resumable = new XMLHttpRequest();
        resumable.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', true);
        resumable.setRequestHeader('Authorization', `Bearer ${response.access_token}`);
        resumable.setRequestHeader('Content-Type', 'application/json');
        resumable.setRequestHeader('X-Upload-Content-Length', file.size);
        resumable.setRequestHeader('X-Upload-Content-Type', contentType);
        resumable.onreadystatechange = () => {
          if (resumable.readyState === XMLHttpRequest.DONE && resumable.status === 200) {
            const locationUrl = resumable.getResponseHeader('Location');
            const reader = new FileReader();
            reader.onload = () => {
              const uploadResumable = new XMLHttpRequest();
              uploadResumable.open('PUT', locationUrl, true);
              uploadResumable.setRequestHeader('Content-Type', contentType);
              uploadResumable.setRequestHeader('X-Upload-Content-Type', contentType);
              uploadResumable.onreadystatechange = () => {
                if (uploadResumable.readyState === XMLHttpRequest.DONE && uploadResumable.status === 200) {
                  this.refreshAllFunction();
                }
              };
              this.setState((prevState) => ({
                uploadRequests: [...prevState.uploadRequests, {
                  request: uploadResumable,
                  name: file.name,
                }],
              }));
              uploadResumable.send(reader.result);
            };
            reader.readAsArrayBuffer(file);
          }
        };
        resumable.send(JSON.stringify({
          name: file.name,
          mimeType: contentType,
          'Content-Type': contentType,
          'Content-Length': file.size,
        }));
      });
    });
  }

  render() {
    const { userList, uploadRequests } = this.state;
    const addedAccount = userList.length > 0;
    return (
      <div>
        <Header
          addedAccount={addedAccount}
          authorizeUser={this.authorizeUser}
          onSubmit={this.onFormSubmit}
          refreshAllFunc={this.refreshAllFunction}
        />
        {addedAccount
          ? (
            <Layout
              userList={userList}
              parseIDToken={this.parseIDToken}
              filterFilesInAllAccounts={this.filterFilesInAllAccounts}
            >
              <div className="main-container">
                <div className="main-content">
                  <span className="sync-message">
                    {' '}
                    Last Sync:
                    {' '}
                    {this.state.lastRefreshTime}
                  </span>
                  <UserList
                    userList={userList}
                    parseIDToken={this.parseIDToken}
                    removeFunc={this.signOutFunction}
                    refreshFunc={this.refreshFunction}
                    fileUpload={this.fileUpload}
                    sortFunc={this.changeSortedBy}
                    moveWithin={this.moveWithin}
                    moveExternal={this.moveExternal}
                    loadAuth={this.loadAuthorize}
                    openFolder={this.openFolder}
                    closePath={this.closePath}
                    updatePath={this.updatePath}
                    filterFunc={this.changeFilterType}
                  />
                  {uploadRequests.length > 0 && (
                    <RequestProgress
                      uploadRequests={uploadRequests}
                      clearRequests={this.clearRequests}
                    />
                  )}
                </div>
              </div>
            </Layout>
          )
          : (
            <Welcome
              authorizeUser={this.authorizeUser}
            />
          )}
      </div>
    );
  }
}

export default App;
