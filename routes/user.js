// const {response }=require('express');
var express = require('express');
const { Admin } = require('mongodb');
const { response, render } = require('../app');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');

const userHelpers=require('../helpers/user-helpers');
var user={}
var the_name
var loginMsg=null

const verifyLogin=(req,res,next)=>{
if(req.session.userLoggedIn){
      next()
    }
    else{
      res.redirect('/login')
    }
  }
// var MongoClient = require('mongodb').MongoClient;

let pro=[
  {
    name:"i watch",
    category:"smart-Watch",
    image:"https://m.media-amazon.com/images/I/71GIYSZpW+L._SX522_.jpg"
  },
  {
    name:"samsung",
    category:"smart-Watch",
    image:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MKUU3_VW_34FR+watch-45-alum-starlight-nc-7s_VW_34FR_WF_CO?wid=750&hei=712&trim=1,0&fmt=p-jpg&qlt=95&.v=1632171096000,1631661833000"
  },
  {
    name:"samsung",
    category:"smart-Watch",
    image:"https://rukminim1.flixcart.com/image/612/612/kst9gnk0/smartwatch/j/k/9/1-4-android-sm-r875fzgainu-samsung-yes-original-imag6axcsyt36y8v.jpeg?q=70"
  },
  {
    name:"boat",
    category:"smart-Watch",
    image:"https://m.media-amazon.com/images/I/61QxEC7vxTL._SL1479_.jpg"
  },
  {
    name:"fast-track",
    category:"smart-Watch",
    image:"https://m.media-amazon.com/images/I/71-i9q1lVPL._UL1500_.jpg"
  }
]
/* GET home page. */
router.get('/', function(req, res, next) {
    let user=req.session.user

  if(req.session.user){
    user.Name=req.session.user
    res.render('user/view-products',{user,the_name,pro})
  }

  else if(req.session.admin){

    productHelpers.getAllUsers().then((products)=>{  
      res.render('admin/view-product',{products,admin:'admin-login'})
  
  
    });
  }
  else{
    res.render('user/login',{loginMsg})
    loginMsg=null
  }
});


router.get('/login',(req,res)=>{
  if(req.session.user ){
    res.redirect('/')
  }
  else{

    res.render('user/login',{"loginErr":req.session.userloginErr})
    req.session.userloginErr=false
  }
})
router.get('/signup',(req,res)=>{
  
 
  try{res.render('user/signup',{signupMsg})}
  catch{
 res.render('user/signup')
  }
  signupMsg=null
})
router.post('/signup',(req,res)=>{
    console.log(response);
    userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);

    if(response){

      req.session.user=response
      req.session.loggedIn=true
      res.redirect('/')
    }
    else{
      signupMsg="already existing user";
      // res.render("user/signup",{signupMsg})
      res.redirect("/signup")
    }
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.user){
      the_name=response.user
      req.session.user=response.user
      req.session.user.loggedIn=true
      res.redirect('/')
      console.log('got this far for user')
    }
    else if(response.admin){
      req.session.admin=true
      res.redirect('/')
    }
    else
    {
      loginMsg="invalid username or password"
      // res.session.userloginErr="invalid usernam or password",
      // res.redirect('/login')
      req.session.loginErr="invalid username or password"
      // res.render('user/login')
      res.redirect('/')
    }
  })
})

router.get('/logout',(req,res)=>{

  req.session.destroy()
  // req.session.user=null
  // req.session.userLoggedIn=false
  res.redirect('/')
})

module.exports = router;


