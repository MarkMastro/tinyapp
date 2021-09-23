const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['MARKM'],
  maxAge: 24 * 60 * 60 * 1000,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
const PORT = 8080;

app.set('view engine','ejs');

const {randomFunction,urlsForUser,emailLookup} = require('./helpers');

//users database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  }
};

//global "database" to be used by each endpoint
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

//show all urls
app.get("/urls",(req,res)=>{
  if (req.session.user_id) {
  const templateVars = {
    urls:urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id]
  };
  
  res.render("urls_index",templateVars);
  }
  else{
    const templateVars = {
      user: null
    };
    res.render("register",templateVars);
  }
});

//create shortened url:long url and add to urldatabase
//long url will be what is submitted from the form on urls_new.ejs
app.post("/urls", (req, res) => {
  if (req.session.user_id) {
    const shortURL = randomFunction();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.user_id,
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send("You must be logged in to a valid account to create short URLs.");
  }
});
//display endpoint to enter new url
app.get("/urls_new",(req,res)=>{
  if (req.session.user_id) {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render("urls_new",templateVars);
  } else {
    res.redirect("/login");
  }
});
//redirect GETs of the shortened url to the proper longurl
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
//log the user in
app.post("/login", (req,res)=>{
  for (const user in users) {
    if (users[user].email === req.body.email && bcrypt.compareSync(req.body.password, users[user].password)) {
      req.session.user_id = users[user].id;
      res.redirect("urls");
    }
  }
  res.sendStatus(403);
});

app.get("/login", (req,res)=>{
  let templateVars = {
    user: null
  };
  res.render("login",templateVars);
});

//log the user out and bring them back to main page
app.post("/logout",(req,res)=>{
  res.clearCookie('session');
  res.redirect("/login");
});
//delete a url when button is pressed
app.post("/urls/:shortURL/delete",(req,res)=>{

  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL]
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }
});
//show the shortened url page
app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    const templateVars = {
      user:users[req.session.user_id],
      shortURL: req.params.shortURL,
      longURL:urlDatabase[req.params.shortURL].longURL
    };
  
    res.render("urls_show", templateVars);
  } else {
    res.status(400);
    res.send('This tiny url does not belong to you or you are not logged in!');
  }
});
//update url
app.post("/urls/:shortURL", (req,res)=>{
  if (req.params.shortURL) {
    urlDatabase[req.params.shortURL].longURL=req.body.longURL;
    res.redirect('/urls');
  }
  
});

app.get("/register",(req,res)=>{
  
  const templateVars = {
    user: null
  };
  res.render("register",templateVars);
});

app.post("/register",(req,res)=>{
  if (req.body.email.length === 0 || req.body.password.length === 0) {
    res.sendStatus(400);
  } else if (emailLookup(req.body.email.users)) {
    res.sendStatus(400);
  }
  let id = randomFunction();
  users[id] = {
    id,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  req.session.user_id = id;
  res.redirect('/urls');
});
//turn server on
app.listen(PORT,()=>{
  console.log("server listening ");
});