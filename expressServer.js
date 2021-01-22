const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const userDatabase = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync('123', 10)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync('dishwasher-funk',10)
  },
  "user3randomID": {
    id: "user3RandomID",
    email: "birdsarecool@hotmail.com",
    password: bcrypt.hashSync('parrots',10)
  }
};

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

const getUserByEmail = (email) => {
  for (let userID in userDatabase) {
    let userObject = userDatabase[userID];
    // console.log(userObject);
    if (userObject.email === email) {
      return userObject;
    }
  } 
  return null;
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

const urlsForUser = (userID) => {
  let userUrlsObject = {};
  for (let shortURL in urlDatabase) {
    if(userID === urlDatabase[shortURL].userID) {
      userUrlsObject[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrlsObject;
};

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/register', (req, res) => {
  let templateVars = {user: null};
  res.render('register', templateVars);
});

app.get('/login', (req, res) => {
  let templateVars = {user: null}
  res.render('login', templateVars);
});

app.get('/urls', (req, res) => {
  const id = req.cookies['user_id'];
  const user = userDatabase[id];
  if (!user) {
    res.redirect('/login');
  }

  const urls = urlsForUser(id);
  let templateVars = {urls, user}
  console.log(templateVars);
  res.render("urlsIndex", templateVars);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies['user_id'];
  const user = userDatabase[id];

  let templateVars = {user};

  res.render("urlsNew", templateVars)
 
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const urlObj = urlDatabase[shortURL];
  const longURL = urlObj.longURL;
  const id = req.cookies['user_id'];
  const user = userDatabase[id];

  let templateVars = {user, shortURL, longURL}
  res.render("urlsShow", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});



app.post('/register', (req, res) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  const password = bcrypt.hashSync(plainTextPassword, 10);
  if(email === "" || plainTextPassword === "") {
    return res.status(400).send('Invalid email or password');
  } 
  else if (getUserByEmail (email, userDatabase)) {
    return res.status(400).send('An account with this email address already exits');
  } 
  const id = generateRandomString();
  const user = {id, email, password};
  userDatabase[id] = user;

  res.cookie('user_id', id);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  let userObject = getUserByEmail(email, userDatabase);
    if (!userObject) {
      return res.status(403).send('Email cannot be found');
    } 
    if (!bcrypt.compareSync(plainTextPassword, userObject.password)) {
      return res.status(403).send('Invalid email or password');
    }
    if (userObject && bcrypt.compareSync(plainTextPassword, userObject.password)) {
    res.cookie('user_id', user.id);
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID =  req.cookies['user_id'];
  urlDatabase[shortURL] = {
    userID,
    longURL,
  };
  res.redirect(`/urls/${shortURL}`) 
 });

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL;
  const userID =  req.cookies['user_id'];
  urlDatabase[shortURL] = {
    userID,
    longURL,
  };
  res.redirect('/urls/' + shortURL);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  if(userID === urlDatabase[shortURL].userID){
    delete urlDatabase[shortURL];
    res.redirect("/urls/:shortURL") 
  } else {
    res.status(403).send('Invalid user id, cannot edit')
  }
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  if(userID === urlDatabase[shortURL].userID){
    delete urlDatabase[shortURL]; 
    res.redirect("/urls")
  } else {
    res.status(403).send('Invalid user id, cannot delete')
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls")
  });







