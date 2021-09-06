const express=require('express');
const app=express();
const bodyParser = require("body-parser");
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
  const templateVars={urls: urlDatabase};
  res.render("urls_index",templateVars)
})

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls_new",(req,res)=>{
  res.render("urls_new")
})

app.get("/hello", (req,res)=>{
  const templateVars={greeting:'Hello World!'};
  res.render("hello_world",templateVars)
});

app.get("/urls/:shortURL", (req, res) => {
  
  const templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL] };
  console.log(templateVars)
  res.render("urls_show", templateVars);
});

app.listen(PORT,()=>{
  console.log("server listening ")
});