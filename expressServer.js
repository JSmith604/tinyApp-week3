//Dependencies 
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();

//Helper Functions
const { getUserByEmail, urlsForUser, generateRandomString } = require('./helpers');

//Local Host
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));

//Encrypted Cookies
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
  maxAge: 24 * 60 * 60 * 100
}));

//View Engine
app.set("view engine", "ejs");

//Server Listening
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

//User Registration
app.get('/register', (req, res) => {
  let templateVars = {user: null};
  res.render('register', templateVars);
});

//Login Page
app.get('/login', (req, res) => {
  let templateVars = {user: null};
  res.render('login', templateVars);
});

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//Make Sure User Is Logged In
app.get('/urls', (req, res) => {
  const id = req.session.user_id;
  const user = userDatabase[id];


  if (!user) {
    res.redirect('/login');
  }

  const urls = urlsForUser(id, urlDatabase);
  let templateVars = {urls, user};
  console.log(templateVars);
  res.render("urlsIndex", templateVars);
});

//Get New Urls
app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const user = userDatabase[id];

  let templateVars = {user};

  res.render("urlsNew", templateVars);
 
});

//Make Sure User Exits/ Is Logged In 
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const id = req.session.user_id;
  const user = userDatabase[id];
  if (!req.session.user_id) {
    res.status(401).send('Please login or create an account.');
  } if (req.session.user_id !== urlDatabase[shortURL].userID) {
    res.status(403).send('User ID does not match URL');
  } else {
    let templateVars = {user, shortURL, longURL};
    res.render("urlsShow", templateVars);
  }
});

//Redirect To Long Url 
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//Create New User With Secure Password
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

//Permissions For Login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  let userObject = getUserByEmail(email, userDatabase);
  if (!userObject) {
    res.status(403).send('Email cannot be found');
  } else if (!bcrypt.compareSync(plainTextPassword, userObject.password)) {
    return res.status(403).send('Invalid email or password');
  }
  if (userObject && bcrypt.compareSync(plainTextPassword, userObject.password)) {
    req.session.user_id =  userObject.id;
    res.redirect('/urls');
  }
});

//Create Short Url
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userID =  req.session.user_id;
  urlDatabase[shortURL] = {
    userID,
    longURL,
  };
  res.redirect(`/urls/${shortURL}`);
});

//Navigate To Short Url
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const userID =  req.session.user_id;
  urlDatabase[shortURL] = {
    userID,
    longURL,
  };
  res.redirect('/urls/' + shortURL);
});

//Edit Urls
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls/:shortURL");
  } else {
    res.status(403).send('Invalid user id, cannot edit');
  }
});

//Delete Urls
app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send('Invalid user id, cannot delete');
  }
});

//Logout of Tiny App 
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});







