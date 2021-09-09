const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
const PORT = 8080;

app.set('view engine','ejs');

//function to create set of 6 random letters to be our shortened link
const randomFunction = ()=>{
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; //allowed characters in short url
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

//global "database" to be used by each endpoint 
const urlDatabase = {

};

app.get("/urls.json", (req,res)=>{
  res.json(urlDatabase);
});

//show all urls
app.get("/urls",(req,res)=>{
  const templateVars = {
    username:req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index",templateVars);
});

//create shortened url:long url and add to urldatabase
//long url will be what is submitted from the form on urls_new.ejs
app.post("/urls", (req, res) => {
  let randomLetters = randomFunction();
  urlDatabase[randomLetters] = req.body.longURL;
  res.redirect(`/urls/${randomLetters}`);    
});
//display endpoint to enter new url
app.get("/urls_new",(req,res)=>{
  let templateVars = {
    username:req.cookies["username"]
  };
  res.render("urls_new",templateVars);
});
//redirect GETs of the shortened url to the proper longurl
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//log the user in
app.post("/login", (req,res)=>{
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});
//log the user out and bring them back to main page
app.post("/logout",(req,res)=>{
  res.clearCookie('username');
  res.redirect("/urls");
});
//delete a url when button is pressed
app.post("/urls/:shortURL/delete",(req,res)=>{
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});
//show the shortened url page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    username:req.cookies["username"],
    shortURL: req.params.shortURL,
    longURL:urlDatabase[req.params.shortURL]
  };
  
  res.render("urls_show", templateVars);
});
//update url
app.post("/urls/:shortURL", (req,res)=>{
  if (req.params.shortURL) {
    urlDatabase[req.params.shortURL] = req.body.longURL;
  }
  res.redirect('/urls');
});
//turn server on
app.listen(PORT,()=>{
  console.log("server listening ");
});