//Find A User By Email 
const getUserByEmail = (email, database) => {
  for (let userID in database) {
    let userObject = database[userID];
    if (userObject.email === email) {
      return userObject;
    }
  } 
  return undefined;
};

//Search For A Users URLS
const urlsForUser = (userID, database) => {
  let userUrlsObject = {};
  for (const [key, value] of Object.entries(database)) {
    if (userID === value["userID"]) {
      userUrlsObject[key] = {longURL: value["longURL"], userID: value["userID"]};
    }
  }
  return userUrlsObject;
};

//Generate A Random String For Short URL
const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

module.exports = {
  getUserByEmail,
  urlsForUser,
  generateRandomString,
};