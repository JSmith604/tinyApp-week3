const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

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
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "user3randomID": {
    id: "user3RandomID",
    email: "birdsarecool@hotmail.com",
    password: "parrots"
  }
};

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

const emailLookup = (email) => {
  for (let userID in userDatabase) {
    let userObject = userDatabase[userID];
    console.log(userObject);
    if (userObject.email === email) {
      return userObject;
    }
  } 
  return null;
};

const templateWithEmail = (req) => {
  const id = req.cookies['user_id'];
  let userEmail;
  if (id) {
     userEmail = userDatabase[id]['email'];
  };
  const templateVars = {
    
    userEmail,
  }
  return templateVars;
};

const urlsForUser = (userID) => {
  let userUrlsObject = {};
  for (let shortURL in urlDatabase) {
    if(userID === urlDatabase[shortURL].userID) {
      userUrlsObject[shortURL] = urlDatabase[shortURL];
    }
  }
};

app.get('/register', (req, res) => {
  let templateVars = templateWithEmail(req);
  res.render('register', templateVars);
});

app.get('/login', (req, res) => {
  let templateVars = templateWithEmail(req);
  res.render('login', templateVars)
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
  res.render("urlsIndex", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = templateWithEmail(req);
  templateVars['shortURL'] = req.params.shortURL
  console.log(urlDatabase, req.params.shortURL);
  templateVars['longURL'] = urlDatabase[req.params.shortURL]["longURL"];

  res.render("urlsShow", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]["longURL"];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars = templateWithEmail(req);
  if (!templateVars.userEmail) {
    res.redirect('/login');
  } else {
    res.render("urlsNew", templateVars)
  }
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if(email === "" || password === "") {
    return res.status(400).send('Invalid email or password');
  } else if (emailLookup(email)) {
    return res.status(400).send('An account with this email address already exits');
  } 
  const id = generateRandomString();
  const user = {
    id,
    email,
    password
  }
  userDatabase[id] = user;
  res.cookie('user_id', id);
  console.log(user);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let userObject = emailLookup(email);
    if (!userObject) {
      res.status(403).send('Email cannot be found');
    } else if (userObject.password !== password) {
      return res.status(403).send('Invalid email or password');
    }
    if(userObject && userObject.password === password) {
      res.cookie('user_id', userObject.id);
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
  const shortURL = generateRandomString();
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
  delete urlDatabase[shortURL];
  res.redirect("/urls/:shortURL")
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls")
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls")
  });







