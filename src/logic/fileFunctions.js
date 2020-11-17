// eslint-disable-next-line
export const starFilterHelper = (userList) => {
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
  return updatedList;
};
