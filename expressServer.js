const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDatabase = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get('/register', (req, res) => {
  const id = req.cookies['id'];
  let userEmail;
  if (id) {
     userEmail = userDatabase[id]['email'];
  };
  const templateVars = { 
    userEmail
  };

  res.render('register', templateVars);
});

app.get('/login', (req, res) => {
  const username = name.username;
  res.cookie();
  res.redirect("/login");
});

app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const id = req.cookies['id'];
  let userEmail;
  if (id) {
     userEmail = userDatabase[id]['email'];
  };
  const templateVars = {
    urls: urlDatabase,
    userEmail,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const id = req.cookies['id'];
  let userEmail;
  if (id) {
     userEmail = userDatabase[id]['email'];
  };
  const templateVars = { shortURL, longURL,
    userEmail
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies['id'];
  let userEmail;
  if (id) {
     userEmail = userDatabase[id]['email'];
  };
  const templateVars = {
    userEmail,
  };
  res.render("urls_new", templateVars)
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const id = generateRandomString();
  const user = {
    id,
    email,
    password
  }
  userDatabase[id] = user;
  res.cookie("id", id);
  console.log(user);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  res.cookie();	  console.log("hello");
  res.redirect("/login");	  console.log(req.body);
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`) 
 });

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/:shortURL")
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  delete urlDatabase[shortURL];
  res.redirect("/urls/:shortURL")
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  delete urlDatabase[shortURL];
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.redirect("/urls")
  });







