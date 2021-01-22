

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
  for (let shortURL in database) {
    if(userID === database[shortURL].userID) {
      userUrlsObject[shortURL] = database[shortURL];
    }
  }
  return userUrlsObject;
};
// const templateWithEmail = (req) => {
//   const id = req.cookies['user_id'];
//   let userEmail;
//   if (id) {
//      userEmail = userDatabase[id]['email'];
//   };
//   const templateVars = {
    
//     userEmail,
//   }
//   return templateVars;
// };

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

module.exports = {
  getUserByEmail,
  urlsForUser,
  generateRandomString,
};