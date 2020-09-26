import React, { Component } from 'react';
import UserList from './UserList';
import Header from './Header';
import { config } from '../config';
import './App.css';

const SCOPE = 'profile email openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file';
const discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const API_KEY = config.web.api_key;
const CLIENT_ID = config.web.client_id;
let ready = false;
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
    ready = false;
    const userInfo = this.parseIDToken(idToken);
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
        parentIds: [],
        folderTrees: [],
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
        this.setfiles(index, window.gapi.client.drive.files, response);
        //this.getFiles(this.state.userList[index].id)
      });
    });
  }




/*
* Function to allow unlimited number of files to be pulled
* Needs to call api.list() until the nextPageToken object reurned is null
* try finding example online, requires the promise to be inside a loop or recusive call, which is difficult


  listAdditionalFiles = (pageToken, files, api) => {
    if (pageToken !== undefined) {
      api.list({
        // fields: 'files(id, name, mimeType, starred, iconLink, shared, webViewLink, parents)',
        fields : '*',
        orderBy: 'folder',
        q : "trashed = false",
        pageSize: 100,
        corpera : 'allDrives',
        includeItemsFromAllDrives : 'true',
        supportsAllDrives : 'true',
        pageToken : pageToken
      }).then((response) => {
        files = files.concat(response.result.files)
        pageToken = response.result.nextPageToken
        console.log(files)
        return this.listFiles(pageToken,files, api)
        
   
          });
      }
    } else {
      return files
    }
  */








  /**
   * Stores the files for the given user
   * @param {Number} index the index of the user to store the files
   * @param {Object} fileApi reference to drive.files
   * Right now will only fetch a limited number(unnsure how many) of files due to Google api bug. 
   * The more fields requested, the lower the max files. It should be 1000 but is less due to this, works with at least 188 right now (my number of files)
   * To fix use nextPageTokens, see method above 
   */

  setfiles = (index, fileApi,auth) => {
    console.log(window.gapi.client.drive)
  

    fileApi.list({
      fields: 'files(id, name, mimeType, starred, iconLink, shared, webViewLink, parents, driveId)',
     
      orderBy: 'folder',
      //q: "'1bE-jTd4HO8VwVEtuBqeFkABE07alOSka' in parents and trashed = false"
      q : "trashed = false",
      pageSize: 1000,
      
      maxResults : 1000,

      corpera : 'allDrives',
      includeItemsFromAllDrives : 'true',
      supportsAllDrives : 'true',
    }).then((response) => {
      this.setState((prevState) => {
        const newUserList = prevState.userList;
        newUserList[index].files = response.result.files;
        console.log(response.result.files)
        newUserList[index].filesWithChildren = this.assignChildren(response.result.files)
        newUserList[index].filesWithChildren = this.findTopLevel(newUserList[index].filesWithChildren)
        //console.log(newUserList[index].filesWithChildren)
        

       newUserList[index].topLevelFolders = this.findTopLevelFolders(newUserList[index].filesWithChildren)
        let childFolderList = newUserList[index].files.filter(file => file.mimeType === "application/vnd.google-apps.folder" || file.parents != undefined);
        let allFolders = childFolderList.filter(file => file.mimeType === "application/vnd.google-apps.folder");
        childFolderList = childFolderList.filter(f => !newUserList[index].topLevelFolders.includes(f));

        newUserList[index].looseFiles = this.findLooseFiles(response.result.files, allFolders)
        //newUserList[index].folderTrees = this.createFileTrees(newUserList[index].topLevelFolders, childFolderList)
        newUserList[index].openFolders = [];
        console.log(newUserList[index].openFolders);
        
        console.log( newUserList[index].looseFiles)
        console.log(newUserList[index].filesWithChildren)
        console.log( newUserList[index].topLevelFolders)
      
        ready = true;
        return {
          userList: newUserList,
        };
    })
  
  },
  (err) => { console.error('Execute error', err); })

  }


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



 

assignChildren = (files) => {
  let currentFile;
  let filesWithChildren = []
  for (let i = 0; i < files.length; i++) {
    currentFile = files[i];
    let fileObj = new Object()
      fileObj.file = currentFile
      fileObj.children = []
      fileObj.display = true;
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

findTopLevel = (filesWithChildren) => {
  for (let i = 0; i< filesWithChildren.length; i++) {
    filesWithChildren[i].display = !(this.checkIfChild(filesWithChildren[i].file, filesWithChildren));
  }
  console.log(filesWithChildren)
  return filesWithChildren
}

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

toggleChildren = (userId, folder, fId) => {
  const index = this.getAccountIndex(userId);
  const { userList } = this.state;
  let isTopLevel = false;
  let parent;
  let parentIndex;
  console.log(folder)

   //adds file to the filePath in openFolder[]
   if (folder.file === undefined) {
    isTopLevel = false;
    let fileObj = new Object()
    fileObj.file = folder;
    fileObj.children = this.buildChildrenArray(folder, userId);
    fileObj.folderId = fId;
    console.log(fileObj.children)
        //finds current index of the folderList
        //for (let j = 0; j <  folder.parents.length; j++) {
          for (let k = 0; k < userList[index].openFolders.length; k++) {
              if (userList[index].openFolders[k].fId === fId) {
                parent = userList[index].openFolders[k]
                parentIndex = k;
                //break;
              }
          }
       // }
       console.log(fileObj)
       console.log(userList[index].openFolders[parentIndex])
       let filepathNew = new Object()
        filepathNew.id = fileObj.file.id,
        filepathNew.name = fileObj.file.name
        filepathNew.fId = fId;
        let filepathArray =  userList[index].openFolders[parentIndex].filepath
        filepathArray.push(filepathNew)
        fileObj.filepath = filepathArray

        fileObj.fId = parent.fId
        userList[index].openFolders[parentIndex] = fileObj;

  } else {
    let fileObj = new Object()
    fileObj.fId = folderId;
    fileObj.file = folder.file
    fileObj.children = folder.children
    fileObj.filepath = [{
      id : folder.file.id, 
      name : folder.file.name,
      fId : fileObj.fId,
    }]
     // fileObj.fId = folderId;
      folderId ++;
    userList[index].openFolders.push(fileObj);
   } 


  

   console.log(userList[index].openFolders)
  this.setState((prevState) => {
    const newUserList = prevState.userList
    return {
      userList: newUserList,
    }
})
}


buildChildrenArray = (folder, userId) => {
  let childrenArray = [];
  let files = [];
  console.log(folder)
  const index = this.getAccountIndex(userId);
  const { userList } = this.state;
  files = userList[index].files.filter(file => file.parents !== undefined);
  console.log(files)
    for (let j = 0; j < files.length; j++) {
      if (files[j].parents.includes(folder.id)) {
        childrenArray.push(files[j])
        //break;
    }
  }
  console.log(childrenArray)
  return childrenArray;
}


findUniqueParentsById = (files) => {
  let parentsIds = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i].parents !== undefined) {
      if (!parentsIds.includes(files[i].parents[0])) {
       parentsIds.push(files[i].parents[0])
      }
  }
}
return parentsIds;
}

findUniqueParents = (parentIds, files, userId) => {
  let parentsFiles = [];
  for (let i = 0; i < parentIds.length; i++) {
    files.find((file) => {
         if (file.id === parentIds[i]) {
             parentsFiles.push(file)
         }
          
      }) 
    }
   // files.find((file) => {
    //  if (file.parents === undefined) {
         // parentsFiles.push(file)
      //}
   // })
return parentsFiles;
}


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


createFileTrees = (topFolderList, childrenFolderList)  =>  {
let folderTreeArray = [];
for (let i = 0; i < topFolderList.length; i++) {
  let topFolderId = topFolderList[i].file.id;

            let folderTree = function c(folder, folderSt, res) {
                let ar = childrenFolderList.filter(e => e.parents[0] == folder);
               // folderSt += folder + "#_aabbccddee_#";
                //let arrayFolderSt = folderSt.split("#_aabbccddee_#");
                //arrayFolderSt.pop();
                res.push(ar);
                ar.length == 0 && (folderSt = "");
                ar.forEach(e => c(e.id, folderSt, res));
                return res;
            }(topFolderId, "", []);

            folderTreeArray[i] = folderTree;
            console.log(folderTreeArray)
            

          }
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
   */
  refreshFunction = (id) => {
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
          isChildFunc={this.checkIfChild}
          toggleChildrenFunc={this.toggleChildren}
          buildChildrenArray = {this.buildChildrenArray}
        />
      </div>
    );
  }
}

export default App;
