import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import UserList from './components/UserList';
import RequestProgress from './components/RequestProgress';
import Layout from './components/Layout';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Loading from './components/Loading';
import { config } from './config';
import './App.css';

const SCOPE = 'profile email openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
const discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key;
const CLIENT_ID = config.web.client_id;
let userId = 1;
const cookies = new Cookies();
// cookies expire in 20 years
const d = new Date();
const year = d.getFullYear();
const month = d.getMonth();
const day = d.getDate();
const cookieExpire = new Date(year + 20, month, day);

const cookieOptions = {
  path: '/',
  expires: cookieExpire,
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      userList: [],
      uploadRequests: [],
      lastRefreshTime: Date().substring(0, 21),
      filterQuery: 'trashed = false',
      searchQuery: 'name contains ""',
      isLoading: false,
      starred: false,
    };
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.onload = this.handleClientLoad;
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
    setTimeout(() => {
      this.startUp();
    }, 1000);
    this.interval = setInterval(() => {
      this.refreshAllFunction();
    }, 300000);
  }

  handleClientLoad = () => {
    window.gapi.load('client:auth');
  }

  /**
   * Retrieves the cookies and authorizes each user
   */
  startUp = () => {
    const cookie = cookies.getAll();
    Object.values(cookie).forEach((email) => {
      if (email !== 'light' && email !== 'dark') {
        this.reAuthorizeUser(email);
      }
    });
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

  reAuthorizeUser = (email) => {
    window.gapi.load('client:auth', () => {
      window.gapi.auth2.authorize({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPE,
        responseType: 'id_token permission code',
        prompt: 'none',
        login_hint: email,
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
  signOutFunction = (id, removeAll) => {
    const { isLoading } = this.state;
    if (!isLoading) {
      if (removeAll) {
        this.setState((prevState) => {
          const newUserList = prevState.userList.filter((user) => user.id !== id);
          return {
            userList: newUserList,
          };
        });
        const index = this.getAccountIndex(id);
        const { userList } = this.state;
        const userInfo = this.parseIDToken(userList[index].idToken);
        const { email } = userInfo;
        cookies.remove(email, cookieOptions);
      } else if (window.confirm('Are you sure you want to remove this account?')) {
        this.setState((prevState) => {
          const newUserList = prevState.userList.filter((user) => user.id !== id);
          return {
            userList: newUserList,
          };
        });
        const index = this.getAccountIndex(id);
        const { userList } = this.state;
        const userInfo = this.parseIDToken(userList[index].idToken);
        const { email } = userInfo;
        cookies.remove(email, cookieOptions);
      }
    }
  }

  removeAllAccounts = () => {
    const { isLoading } = this.state;
    if (!isLoading) {
      const { userList } = this.state;
      if (window.confirm('Are you sure you want to remove all accounts?')) {
        for (let i = 0; i < userList.length; i++) {
          this.signOutFunction(userList[i].id, true);
        }
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
          sortedBy: 'folder, viewedByMeTime desc',
          filteredBy: '',
          storedFolderList: null,
        }],
      }));
      cookies.set(email, email, cookieOptions);
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
    this.setState({ isLoading: true });
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
      searchQuery = `name contains '${searchInput}'`;
      const newUserList = this.state.userList;
      //checks if search input is empty, or spaces only
      if (searchInput !== "" ||(!str.replace(/\s/g, '').length === 0)) {
      for (let i = 0; i < this.state.userList.length; i++) {
        if ( newUserList[i].storedFolderList === null) {
        newUserList[i].storedFolderList = newUserList[i].folders;
      }
    }
    } else {
      for (let i = 0; i < this.state.userList.length; i++) {
        newUserList[i].storedFolderList = null;
      }

    }
    console.log(newUserList)
    this.setState(
      {
        userList: newUserList,
       searchQuery },this.refreshAllFunction());
 
  }

  filterFilesInAllAccounts = (filter) => {
    this.setState({ starred: false });
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
      updatedList[index].folders = {};
      updatedList[index].topLevelFolders = [];
      updatedList[index].looseFiles = [];
      // Put folders in own data struct
      for (let i = 0; i < results.length; i++) {
      }
      let i = -1;
      while (++i < results.length && results[i].mimeType === 'application/vnd.google-apps.folder') {
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
      const newOpenFolders = updatedList[index].openFolders;
      for (let oId = 0; oId < newOpenFolders.length; oId++) {
        let pathIndex = 0;
        while (newOpenFolders[oId] && newOpenFolders[oId].path && pathIndex < newOpenFolders[oId].path.length) {
          const oldPath = newOpenFolders[oId].path;
          if (!updatedList[index].folders.hasOwnProperty(oldPath[pathIndex].id)) {
            if (pathIndex === 0) {
              newOpenFolders.splice(oId, 1);
              oId--;
            } else {
              // Cut off the rest of the folders
              newOpenFolders[oId].path.splice(pathIndex, (oldPath.length - pathIndex));
              // newOpenFolders[oId].displayed = updatedList[index].folders[oldPath[pathIndex - 1].id].children;
            }
          }
          pathIndex++;
        }
        updatedList[index].openFolders = newOpenFolders;
        if (newOpenFolders[oId] && newOpenFolders[oId].path) {
          this.openFolder(updatedList[index].id, oId, newOpenFolders[oId].path[newOpenFolders[oId].path.length - 1], true);
        }
      }
      this.setState({ userList: updatedList, isLoading: false });
      if (this.state.starred === true) {
        this.starredFilter();
      }
    }, email, user);
  }

  /**
   *
   * @param {*} userId Id of the user that is having a file opened
   * @param {*} oId Index of the path in the openFolders array
   * @param {*} folder Folder being opened
   */
  openFolder = (userId, oId, folder, isUpdate) => {
    if (!this.state.isLoading){
    const index = this.getAccountIndex(userId);
    const updatedList = this.state.userList;
    const newOpenFolders = updatedList[index].openFolders;
    let folderList = updatedList[index].folders;
    //check to see if folder is from search result

    console.log(updatedList[index].storedFolderList)
      if (updatedList[index].storedFolderList !== null) {
        folderList = updatedList[index].storedFolderList;
      }
      console.log(updatedList[index].folders)
      console.log(folderList)
    // If folder is topLevel, we will pass in -1 oId for these, create new open folder
    if (oId === -1) {
   // another check to see if folder form search result is a nested folder 
    console.log(folderList[folder.id]);


      newOpenFolders.push({
        path: [folder],
        displayed: folderList[folder.id].children,
      });
      updatedList[index].openFolders = newOpenFolders;
      this.setState({ userList: updatedList });
    // If folder is not top level it is part of a filePath already
    } else if (!isUpdate) {
      newOpenFolders[oId].path.push(folder);
      newOpenFolders[oId].displayed = folderList[folder.id].children;
      updatedList[index].openFolders = newOpenFolders;
      this.setState({ userList: updatedList });
    } else {
      newOpenFolders[oId].displayed = folderList[folder.id].children;

      updatedList[index].openFolders = newOpenFolders;

      this.setState({ userList: updatedList });
    }
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
    if (updatedList[index].storedFolderList !== null) {
      newOpenFolders.displayed = this.state.userList[index].storedFolderList[newOpenFolders.path[pId].id].children;
    } else {
    newOpenFolders.displayed = this.state.userList[index].folders[newOpenFolders.path[pId].id].children;
    }
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
        if (file.parents === undefined || (file.parents.length === 1 && file.parents[0][0] === '0' && file.parents[0][1] === 'A')) {
          alert('File is already in root');
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
            this.refreshFunction(userId);
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

  starredFilter = () => {
    this.setState({ isLoading: true, starred: true });
    const { userList } = this.state;
    const updatedList = userList;
    for (let i = 0; i < updatedList.length; i++) {
      const starred = [];
      for (const prop in updatedList[i].folders) {
        if (updatedList[i].folders[prop].folder.starred) {
          starred.push(updatedList[i].folders[prop]);
        }
      }
      updatedList[i].topLevelFolders = starred;
      starred.forEach((f, k) => {
        updatedList[i].topLevelFolders[k] = f;
      });
      updatedList[i].looseFiles = updatedList[i].looseFiles.filter((file) => file.starred);
      const newOpenFolders = updatedList[i].openFolders;
      for (let oId = 0; oId < updatedList[i].openFolders.length; oId++) {
        let del = true;
        if (newOpenFolders[oId] && newOpenFolders[oId].path && newOpenFolders[oId].path[0]) {
          for (let k = 0; k < updatedList[i].topLevelFolders.length; k++) {
            if (updatedList[i].topLevelFolders[k].id === newOpenFolders[oId].path[0].id) {
              del = false;
              break;
            }
          }
          if (del) {
            newOpenFolders.splice(oId, 1);
          }
        }
      }
      updatedList[i].openFolders = newOpenFolders;
    }
    this.setState({
      userList: updatedList, isLoading: false,
    });
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
    const { userList, uploadRequests, isLoading } = this.state;
    const cookie = cookies.getAll();
    const addedAccount = !((Object.keys(cookie).length === 0 || (Object.keys(cookie).length === 1 && Object.keys(cookie).includes('theme'))) && cookie.constructor === Object);
    return (
      <div>
        <Header
          addedAccount={addedAccount}
          onSubmit={this.onFormSubmit}
          refreshAllFunc={this.refreshAllFunction}
          syncMessage={this.state.lastRefreshTime}
        />
        {isLoading && (
          <Loading />
        )}
        {addedAccount
          ? (
            <Layout
              authorizeUser={this.authorizeUser}
              filterFilesInAllAccounts={this.filterFilesInAllAccounts}
              parseIDToken={this.parseIDToken}
              removeAllAccounts={this.removeAllAccounts}
              starFilter={this.starredFilter}
              userList={userList}
            >
              <div className="main-container">
                <div className="main-content">
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
