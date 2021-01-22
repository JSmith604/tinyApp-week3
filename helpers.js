

const getUserByEmail = (email, database) => {
  for (let userID in database) {
    let userObject = database[userID];
    if (userObject.email === email) {
      return userObject;
    }
  } 
  return undefined;
};

/*

1. user id === aJ48lW

2. const urlDatabase = {
   b6UTxQ: { longURL: "https://www.tsn.ca", userID: "bsddW" },
   i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
   asdass: { longURL: "https://www.google.ca", userID: "aJ48lW" },
   i26584: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

loop 1:
userUrlsObject {}

loop2: 
userUrlsObject {
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
} 

loop 3: 

userUrlsObject {
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
  asdass: { longURL: "https://www.google.ca", userID: "aJ48lW" }
} 

loop 4: 

userUrlsObject {
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
  asdass: { longURL: "https://www.google.ca", userID: "aJ48lW" }
  i26584: { longURL: "https://www.google.ca", userID: "aJ48lW" }
} 

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries

*/

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

  console.log("userUrlsObject: ", userUrlsObject);
  // for (let shortURL in database) {
  //   if(userID === database[shortURL].userID) {
  //     userUrlsObject[shortURL] = database[shortURL];
  //   }
  // }
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