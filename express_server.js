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

const emailLookup=(email)=>{
  for (let user in users ){
    if (users[user].email===email){
      return true
    }
  }
  return false;
}
//users database
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur",
    urls:[]
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk",
    urls:[]
  }
}

//global "database" to be used by each endpoint 
const urlDatabase = {

};

app.get("/urls.json", (req,res)=>{
  res.json(urlDatabase);
});

//show all urls
app.get("/urls",(req,res)=>{
  const templateVars = {
    user: users[req.cookies.user_id]
  }
  console.log("/urls get")
  console.log(templateVars)
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
  const templateVars = {
    user: users[req.cookies.user_id]
  }
  res.render("urls_new",templateVars);
});
//redirect GETs of the shortened url to the proper longurl
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//log the user in
app.post("/login", (req,res)=>{
  for (const user in users) {
    if (users[user].email===req.body.email &&users[user].password===req.body.password) {
      res.cookie("user_id",user.id);
      res.redirect("urls")
    }
  }
  res.sendStatus(403)
});

app.get("/login", (req,res)=>{
  templateVars={
    user: null
  }
  res.render("login",templateVars)
})

//log the user out and bring them back to main page
app.post("/logout",(req,res)=>{
  res.clearCookie('user_id');
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
    user:users[req.cookies.user_id],
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

app.get("/register",(req,res)=>{
  
  const templateVars = {
    user: null
  }
  res.render("register",templateVars)
})

app.post("/register",(req,res)=>{
  console.log(req.body.email.length,req.body.password.length)
  if(req.body.email.length===0 || req.body.password.length===0){
    res.sendStatus(400)
  }else if(emailLookup(req.body.email)){
    res.sendStatus(400)
  }
  let id=randomFunction();
  users[id]={
    id, 
    email: req.body.email, 
    password: req.body.password,
    urls:[]
  }
  console.log(users)
  res.cookie('user_id',id)
  res.redirect('/urls')
})
//turn server on
app.listen(PORT,()=>{
  console.log("server listening ");
});