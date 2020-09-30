import React, { Component } from 'react';
import UserList from './UserList';
import Header from './Header';
import { config } from '../config';
import './App.css';

const SCOPE = 'profile email openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
const discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key;
const CLIENT_ID = config.web.client_id;
let ready = true;
let userId = 1;
let folderId = 1;

class App extends Component {
  constructor() {
    super();
    this.state = {
      userList: [],
    };
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.onload = this.handleClientLoad;
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);
    //this.interval = setInterval(() => {
     // this.refreshAllFunction();
     //},5000);
  
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
    //ready = false;
    
    const userInfo = this.parseIDToken(idToken);
    console.log(userInfo)
    const { email } = userInfo;
    this.addUser(accessToken, idToken, code);
    const { userList } = this.state;
    const newUserIndex = userList.length - 1;
    this.updateFiles(newUserIndex, accessToken, idToken, email);
  }

  /**
   *  Handles user sign out.
   *  Removes the specified user from the userList array, then updates the State
   * @param {number} id attribute of the specific User tp be removed in the UserList array
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
    this.setState((prevState) => ({
      userList: [...prevState.userList, {
        id: userId,
        accessToken,
        idToken,
        code,
        files: [],
        topLevelFolders: [],
        filesWithChildren: [],
        looseFiles: [],
        openFolders: [],
      }],
    }));
    userId += 1;
  }

  /**
   * Gets the files and stores them for the user at the given index
   * @param {Number} index index of the user in the userList to update
   * @param {Object} files the file object to store
   */
  updateFiles = (index, accessToken, idToken, email) => {
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
        this.getfiles(index, email);
      });
    });
  }


  /**
   * Stores the files for the given user
   * @param {Number} index the index of the user to store the files
   * @param {Object} email email of the user (used for authentication)
   */

  getfiles = (index, email) => {
    this.retrieveAllFiles((result) => {
      this.setState((prevState) => {
        const newUserList = prevState.userList;
        if (newUserList[index] === undefined) {
          return;
        }
        let allFilepaths = [];
        for (let i = 0; i <  newUserList[index].openFolders.length; i++) {
          allFilepaths.push( newUserList[index].openFolders[i].filepath)
          }
        newUserList[index].files = result;
        newUserList[index].filesWithChildren = this.assignChildren(newUserList[index].files)
        newUserList[index].topLevelFolders = this.findTopLevelFolders(newUserList[index].filesWithChildren)
        let childFolderList = newUserList[index].files.filter(file => file.mimeType === "application/vnd.google-apps.folder" || file.parents != undefined);
        let allFolders = childFolderList.filter(file => file.mimeType === "application/vnd.google-apps.folder");
        childFolderList = childFolderList.filter(f => !newUserList[index].topLevelFolders.includes(f));
        newUserList[index].looseFiles = this.findLooseFiles(result, allFolders)
        newUserList[index].openFolders = [];
        for (let i = 0; i < allFilepaths.length; i++) {
          this.filepathTrace(newUserList[index].id, allFilepaths[i][allFilepaths[i].length - 1], allFilepaths[i], true);
        }
        return {
          userList: newUserList,
        };
    }, () => {ready = true;})
  
  }, email)
}



        


  


/**
 * Retrieve all the files of user
 *
 * @param {Function} callback Function to call when the request is complete.
 * @param {String} email email of the user to keep automatically authenticating for each list request
 */
retrieveAllFiles = (callback, email)  => {
  let res = [];
  var retrievePageOfFiles = function(email, response) {
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
      let nextPageToken = response.result.nextPageToken;
      if (nextPageToken) {  
        window.gapi.client.drive.files.list({
          pageToken : nextPageToken,
          fields: 'files(id, name, mimeType, starred, iconLink, shared, webViewLink, parents, driveId), nextPageToken',
          orderBy: 'folder',
            q : "trashed = false",
          pageSize: 1000,
           //maxResults : 10,
            corpera : 'allDrives',
           includeItemsFromAllDrives : 'true',
          supportsAllDrives : 'true',
        }).then((response) =>  {
          retrievePageOfFiles(email, response)}); 
      } else {
        callback(res);
      }
  })
  })
}

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
          orderBy: 'folder',
            q : "trashed = false",
          pageSize: 1000,
           //maxResults : 10,
            corpera : 'allDrives',
           includeItemsFromAllDrives : 'true',
          supportsAllDrives : 'true',
        }).then((response) =>  {
          retrievePageOfFiles(email, response)});
      })
    })
  
 
}


//finds all of the files in the user's drive which are not held within a folder
 /**
   * Decrypts the JSON string idToken in order to access the encrytped user information held within
   * @param {Array} files all of the files belonging to the user (inlcuding folders)
   * @param {Array} folders all of the folders belonging to the user
   */
findLooseFiles = (files, folders) => {
  let looseFiles = [];
  let check = true;;
  files = files.filter(file => file.mimeType != "application/vnd.google-apps.folder")

  //this gets all loosefiles in the shared drive
  looseFiles = files.filter(file => file.parents === undefined);

  //loops to check for loosefiles in myDrive, or any other case where parents is defined, but no parent folder actaully 
  //exists anywhere in the drive
  for (let i = 0; i < files.length; i++) {
    if (files[i].parents != undefined) {
     for (let j = 0; j < folders.length; j++) {
       if (files[i].parents[0] === folders[j].id) {
          check = false;
       }
     }
     if (check) {
      
      looseFiles.push(files[i]);
     }
     check = true;;
    }
  }
  return looseFiles;
}



/**
   * loops through all of the files in the drive, and for each one, creates an object (fileObj) which contains the file itself, 
   * and a list containing all of that file's children (as files) It's O(n^2), n is number of files
   * @param {Array} files all of the files belonging to the user (inlcuding folders)
   */
assignChildren = (files) => {
  let currentFile;
  let filesWithChildren = []
  for (let i = 0; i < files.length; i++) {
    currentFile = files[i];
    let fileObj = new Object()
      fileObj.file = currentFile
      fileObj.children = []
    for (let j = 0; j < files.length; j++) {
      if (files[j].parents !== undefined) {
        if (files[i].id === files[j].parents[0]) {
          fileObj.children.push(files[j])
        }
      }
      
     }
     filesWithChildren[i] = fileObj;
    }  
    return filesWithChildren
  }


/**
   * checks whether the given file is a child of another file(or folder) somewhere in the file list
   * the fileList here should be the filelist returned from assignChildren(), so that each element of the filelist is a fileObj, not just a file
   * @param {Object} file a file (or folder)
   * @param {Array} filesWithChildren all of the fileObj's belonging to the user (as returned from assingChildren)
   */
checkIfChild = (file, filesWithChildren) =>  {
    let i = 0;
    while (filesWithChildren[i].file.mimeType === "application/vnd.google-apps.folder"){
      if (filesWithChildren[i].children.includes(file)) {
        return true;
      }
      i++
    }
    return false;
}



/**
 * displays a folder's contents on the users page by adding the folder to the openFolders array
 * behaves in different ways depending on the inputs -- read comments throughout the function 
 * to see the different cases
   * @param {number} userId id of user
   * @param {Object} folder this can either be a direct folder, or a filObj, depending on where the function was called
   * @param {number} fId this is the folderId asinged to this particular openFolder
   */
openChildren = (userId, folder, fId) => {
  const index = this.getAccountIndex(userId);
  const { userList } = this.state;
  let isTopLevel = false;
  let parent;
  let parentIndex;

   //checks to see whether folder is a fileObj or file itself
   //if it's just a plain file, then file.file is undefiined and proceeds here
   //this happens when the folder is a child of an already open folder
   if (folder.file === undefined) {
    isTopLevel = false;
    let fileObj = new Object()
    fileObj.file = folder;
    fileObj.children = this.buildChildrenArray(folder, userId);
    fileObj.fId = fId;
        //finds current index of the openfolderList
          for (let k = 0; k < userList[index].openFolders.length; k++) {
              if (userList[index].openFolders[k].fId === fId) {
                parent = userList[index].openFolders[k]
                parentIndex = k;
                break;
              }
          }
       let filepathNew = new Object()
        filepathNew.id = fileObj.file.id,
        filepathNew.name = fileObj.file.name
        filepathNew.fId = fId;
        let filepathArray =  userList[index].openFolders[parentIndex].filepath
        filepathArray.push(filepathNew)
        fileObj.filepath = filepathArray
        fileObj.fId = parent.fId
        userList[index].openFolders[parentIndex] = fileObj;

  //this occurs when the folder is not a child of an already open folder
  //the check is to see whether this folder has been instantiated with a folderId already
  //if it has, then this folder is already open, and this function was called from filepath trace
  } else  if (fId != undefined) {
    let fileObj = new Object()
    fileObj.fId = fId;
    fileObj.file = folder.file
    fileObj.children = folder.children
    fileObj.filepath = [{
      id : folder.file.id, 
      name : folder.file.name,
      fId : fileObj.fId,
    }]
     //finds current index of the folderList
    for (let k = 0; k < userList[index].openFolders.length; k++) {
      if (userList[index].openFolders[k].fId === fId) {
        parent = userList[index].openFolders[k]
        parentIndex = k;
        break;
      }
  }
    userList[index].openFolders[parentIndex] = fileObj;
   } 

   //this occurs when a root folder is selected to be opened
   //it creates a new entry in the openFolders array
   else {
    let fileObj = new Object()
    fileObj.fId = folderId;
    fileObj.file = folder.file
    fileObj.children = folder.children
    fileObj.filepath = [{
      id : folder.file.id, 
      name : folder.file.name,
      fId : fileObj.fId,
    }]
      folderId ++;
    userList[index].openFolders.push(fileObj);
   } 
  this.setState((prevState) => {
    const newUserList = prevState.userList
   
    return {
      
      userList: newUserList,
    }
})
}


/**
 * this function is called when a name in the filepath is clicked
 * it rebuilds the current openFolder from the root down, using the filpath array to do so
   * @param {number} userId id of user
   * @param {Object} filepath this is the particular entry in the filepath which was clicked (each filepath has a file id, name, and fId element)
   * @param {Array} filepathArray this is the array which contains all the filepaths of this openFolder (filepathArray[0] will contain the filepath of the root folder)
   */
filepathTrace = (userId, filepath, filepathArray, isUpdate) => {
  
  const index = this.getAccountIndex(userId);
  const { userList } = this.state;
  let topFolder;
  let filepathFinish = 0;
  let childrenArray;
  let changed = false;
  // finds root of the filepath
  for (let i = 0; i < userList[index].topLevelFolders.length; i++) {
    if ( userList[index].topLevelFolders[i].file.id === filepathArray[0].id) {
      topFolder = userList[index].topLevelFolders[i];
    }
  }
  //calculates how many times to run openChildren(how many folders deep the folder desired is)
  for (let i = 0; i <filepathArray.length; i++) {
    if (filepathArray[i] === filepath) {
      break;
    }
    filepathFinish ++;
  }
  //resets openFolder to root and then loops until it reaches the child listed in this filepath
  let filepathCount = 1;
  let k = 0;
  while (k <= filepathFinish) {
    changed = false;
    if (isUpdate != undefined) {
      console.log(topFolder)
      this.openChildrenUpdate(userId, topFolder, filepath.fId)
    } else {
    this.openChildren(userId, topFolder, filepath.fId)
    }
    // handles nested folders
    if (filepathCount === filepathArray.length) {
      return;
    }
    // if folder is deleted or moved, stops
    if (topFolder === undefined) {
      return;
    }
    if (topFolder.file === undefined) {
    childrenArray = this.buildChildrenArray(topFolder, userId)
    for (let i = 0; i < childrenArray.length; i++) {
      if (childrenArray[i].id === filepathArray[filepathCount].id) {
        topFolder = childrenArray[i]
        changed = true;
      }
    }
  //handles topLevel folder
    } else {
    for (let i = 0; i < topFolder.children.length; i++) {
      if (topFolder.children[i].id === filepathArray[filepathCount].id) {
        topFolder = topFolder.children[i];
        changed = true;
        break;
      }
    }
  }
  if (!changed) {
    return;
  }
    filepathCount++;
    k++;
  }

}


// works very similarly to openChildren(), just with some modifications to be able to run from inside setState() call in updateFiles()
openChildrenUpdate = (userId, folder, fId) => {
  const index = this.getAccountIndex(userId);
  const { userList } = this.state;
  let isTopLevel = false;
  let parent;
  let parentIndex;
   // if folder is deleted or moved, stops
   if (folder === undefined) {
     return;
   }
    //checks to see whether folder is a fileObj or file itself
   //if it's just a plain file, then file.file is undefiined and proceeds here
   //this happens when the folder is a child of an already open folder
   if (folder.file === undefined) {
    isTopLevel = false;
    let fileObj = new Object()
    fileObj.file = folder;
    fileObj.children = this.buildChildrenArray(folder, userId);
    fileObj.fId = fId;
        //finds current index of the openfolderList
          for (let k = 0; k < userList[index].openFolders.length; k++) {
              if (userList[index].openFolders[k].fId === fId) {
                parent = userList[index].openFolders[k]
                parentIndex = k;
                break;
              }
          }
       let filepathNew = new Object()
        filepathNew.id = fileObj.file.id,
        filepathNew.name = fileObj.file.name
        filepathNew.fId = fId;
        let filepathArray =  userList[index].openFolders[parentIndex].filepath
        filepathArray.push(filepathNew)
        fileObj.filepath = filepathArray
        fileObj.fId = parent.fId
        userList[index].openFolders[parentIndex] = fileObj;

  //this handles placing the root folder and is slightly different from the normal openChildren()
  } else  if (fId != undefined) {
    let fileObj = new Object()
    fileObj.fId = fId;
    fileObj.file = folder.file
    fileObj.children = folder.children
    fileObj.filepath = [{
      id : folder.file.id, 
      name : folder.file.name,
      fId : fileObj.fId,
    }]

    userList[index].openFolders.push(fileObj);
   } 


}




/**
   * removes the current entry in the openFolder List
   * @param {object} openFolder the current entry in the openFolder array
   * @param {number} userId id of the user
   */
closeFolder = (openFolder, userId) => {
  const index = this.getAccountIndex(userId);
  const { userList } = this.state;
  let i = userList[index].openFolders.findIndex(folder => folder === openFolder);
  userList[index].openFolders.splice(i, 1);
  this.setState((prevState) => {
    const newUserList = prevState.userList
    return {
      userList: newUserList,
    }
})
}


/**
   * returns an array of all of the children of a given folder
   * @param {object} folder a plain ol' folder
   * @param {number} userId id of the user
   */
buildChildrenArray = (folder, userId) => {
  let childrenArray = [];
  let files = [];
  const index = this.getAccountIndex(userId);
  const { userList } = this.state;
  files = userList[index].files.filter(file => file.parents !== undefined);
    for (let j = 0; j < files.length; j++) {
      if (files[j].parents.includes(folder.id)) {
        childrenArray.push(files[j])
    }
  }
  return childrenArray;
}


/**
   * returns an array of all the top level, or root folders (aka folders not contained within another folder)
   * @param {object} fileList list of all the fileObj's of a user (these are fileObj's, returned from assignChildren() and stored in filesWithChildren)
   */
findTopLevelFolders = (fileList) => {
  let top = [];
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].file.mimeType === "application/vnd.google-apps.folder") {
      if (!(this.checkIfChild(fileList[i].file, fileList))){
        let fileObj = new Object();
        fileObj.file = fileList[i].file
        fileObj.children = fileList[i].children
        fileObj.filepath = [];
        top.push(fileObj);
      }

    }
  }
return top;
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
   * TODO: Work in progress
   * @param {*} userId
   * @param {*} fileId
   */
  copyFile = (userId, fileId) => {
    const index = this.getAccountIndex(userId);
    const { userList } = this.state;

    const { accessToken, idToken } = userList[index];
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
          console.log('authorization error');
        }
        // todo: add stuff here to do the copying
        window.gapi.client.drive.files.copy({
          fileId,
        }).then((response) => {
          this.refreshFunction(userList[index].id);
        });
      });
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
    //ready = false;
    const index = this.getAccountIndex(id);

    const { userList } = this.state;

    const { idToken } = userList[index];
    const { accessToken } = userList[index];
    const userInfo = this.parseIDToken(userList[index].idToken);
    const { email } = userInfo;
    this.updateFiles(index, accessToken, idToken, email);
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
      const { idToken } = userList[i];
      const { accessToken } = userList[i];
      const userInfo = this.parseIDToken(userList[i].idToken);
      const { email } = userInfo;
     this.updateFiles(i, accessToken, idToken, email);


     //refreshes every 10 seconds after refresh button is clicked
     //if you set to a time too low, the browser gets locked up in GET requests, and no other messages can get through(e.g. copyfunc won't work anymore)
     this.interval = setInterval(() => {
      this.updateFiles(i, accessToken, idToken, email);
     },1000);

    }
  }

  render() {
    const { userList } = this.state;
    return (
      <div className="App">
        <Header />
        <button type="button" className="button add" id="signin-btn" onClick={() => this.authorizeUser()}>Add an Account</button>
        <button type="button" className="button refresh" id="refreshAll-btn" onClick={() => this.refreshAllFunction()}>
          Refresh All
        </button>
        <UserList
          userList={userList}
          parseIDToken={this.parseIDToken}
          removeFunc={this.signOutFunction}
          refreshFunc={this.refreshFunction}
          copyFunc={this.copyFile}
          filepathTraceFunc={this.filepathTrace}
          isChildFunc={this.checkIfChild}
          openChildrenFunc={this.openChildren}
          closeFolderFunc={this.closeFolder}
          buildChildrenArray = {this.buildChildrenArray}
        />
      </div>
    );
  }
}

export default App;
