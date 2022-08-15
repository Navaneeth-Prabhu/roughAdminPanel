var express = require('express');
const {render, response}=require('../app')
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
/* GET users listing. */

var message

const verifyLogin=(req,res,next)=>{
  if(req.session.admin.loggedIn){
        next()
      }
      else{
        res.redirect('/login')
      }
    }

router.get('/', function(req, res, next) {

    productHelpers.getAllUsers().then((products)=>{
      
      res.render('admin/view-product',{admin:true,products})
    });



  

});
router.get('/add-product',function(req,res){
  console.log("redirecting..");
 try{res.render('admin/add-product',{message})}
 catch{
 res.render('admin/add-product')
 }
})
router.post('/add-product',(req,res)=>{
  console.log(req.body);
  // console.log(req.files.Image);

  productHelpers.addProduct(req.body).then((response)=>{
  // productHelpers.addProduct(req.body,(id)=>{
    // let image=req.files.Image
    // image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
    //   if(!err){
    //     res.render("admin/add-product")
    //   }else{
        // console.log(err)
    // }
    // })

    if(response){
      message = "edit sucess"
      console.log("edit sucuess working");
      res.render('admin/add-product',{message})
      // res.redirect('/add-product')
    }
    else {
      message = "user already exists"
      res.render("admin/add-product",{message})
      // res.redirect('/add-product')
      // console.log("error working");
    }
  })
})

router.get('/delete-user/:id',(req,res)=>{
    let UserId=req.params.id
    console.log(UserId)
    productHelpers.deleteUser(UserId).then((response)=>{
      res.redirect('/admin')
    })
})

router.get('/edit-user/:id',async(req,res)=>{
  let user=await productHelpers.getUserDetails(req.params.id)
  // console.log(products)
  res.render('admin/edit-user',{user})
})

router.post('/edit-user/:id',(req,res)=>{
  productHelpers.updateUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})

/////admin login///////////
router.get('/login',(req,res)=>{
  if(req.session.admin ){
    res.redirect('/')
  }
  else{

    res.render('admin/login',{"loginErr":req.session.adminloginErr})
    req.session.adminloginErr=false
  }
})
module.exports = router;
