

const getUserByEmail = (email, database) => {
  for (let userID in database) {
    let userObject = database[userID];
    if (userObject.email === email) {
      return userObject;
    }
  } 
  return undefined;
};

const urlsForUser = (userID, database) => {
  let userUrlsObject = {};
  console.log("Entire database", database);

  for (const [key, value] of Object.entries(database)) {
    console.log("key inside of urlsForUser(): ", key);
    console.log("value inside of urlsForUser():", value);

    if (userID === value["userID"]) {
      userUrlsObject[key] = {longURL: value["longURL"], userID: value["userID"]};
    }
  }
  return userUrlsObject;
};


const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

module.exports = {
  getUserByEmail,
  urlsForUser,
  generateRandomString,
};