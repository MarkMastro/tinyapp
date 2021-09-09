const express=require('express');
const app=express();
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser')
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
const PORT=8080;

app.set('view engine','ejs')

const randomFunction=()=>{
  var result = '';
  var characters= 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result; 
}


const urlDatabase={
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get("/",(req,res)=>{
 // res.render()
});

app.get("/urls.json", (req,res)=>{
  res.json(urlDatabase);
})

app.get("/urls",(req,res)=>{
  const templateVars={
    username:req.cookies["username"],
    urls: urlDatabase
  };
  res.render("urls_index",templateVars)
})

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  if(req.body.longURL)
  randomLetters=randomFunction()
  urlDatabase[randomLetters]=req.body.longURL
  res.redirect(`/urls/${randomLetters}`)       // Respond with 'Ok' (we will replace this)
});

app.get("/urls_new",(req,res)=>{
  templateVars={
    username:req.cookies["username"]
  }
  res.render("urls_new")
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/login", (req,res)=>{
  res.cookie('username', req.body.username);
  console.log(res.cookie);
  res.redirect("/urls")
})

app.post("/logout",(req,res)=>{
  res.clearCookie('username');
  res.redirect("/urls")
})

app.post("/urls/:shortURL/delete",(req,res)=>{
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
})

app.get("/urls/:shortURL", (req, res) => {
  console.log("/urls/:shorturl");
  const templateVars = { 
    username:req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL:urlDatabase[req.params.shortURL] 
  };
  
  console.log(templateVars)
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req,res)=>{
  if(req.params.shortURL){
    urlDatabase[req.params.shortURL]=req.body.longURL
  }
  console.log(urlDatabase[req.params.shortURL],req.body.longURL)
  res.redirect('/urls')
})
app.listen(PORT,()=>{
  console.log("server listening ")
});