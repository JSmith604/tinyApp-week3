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

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

const templateVars = {
  username: req.cookies["username"],
};
res.render("urls_index", templateVars);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//Is the route below necessary?
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/login', (req, res) => {
  const username = name.username;
  res.cookie();
  res.redirect("/login");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urlsIndex", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {shortURL, longURL};
  res.render("urlsShow", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  res.render("urlsNew");
});

app.post("/urls", (req, res) => {
 console.log(req.body);
 const shortURL = generateRandomString();
 const longURL = req.body.longURL;
 urlDatabase[shortURL] = longURL;
 res.redirect(`/urls/${shortURL}`) 
});

app.post('/login', (req, res) => {
  res.cookie();	  console.log("hello");
  res.redirect("/login");	  console.log(req.body);
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect("/urls");

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  delete urlDatabase[shortURL];
  res.redirect("/urls")
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  delete urlDatabase[shortURL];
  res.redirect("/urls/:shortURL")
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/:shortURL")
});





//To use nodemon: type npm start or ./node_modules/.bin/nodemon -L expressServer.js 
//website http://localhost:8080/urls