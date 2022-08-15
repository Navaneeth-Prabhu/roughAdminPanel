var db=require('../config/connection')
var collections=require('../config/collections')

const bcrypt = require('bcrypt')
const { ObjectID, ObjectId } = require('bson')
// const { Admin } = require('mongodb')


const admin={
    Name:"admin",
    Email:'admin@gmail.com',
    Password:"admin",
  }
module.exports={
    doSignup:(user)=>{
        // return new Promise(async(resolve,reject)=>{
        //     userData.Password = await bcrypt.hash(userData.Password,10)
        //     db.get().collection(collection.USER_COLLECTION).insertOne(userData)
        //         resolve(userData)
            // })
            return new Promise(async(resolve,reject)=>{
                var success=null
                var isthere=await db.get().collection(collections.USER_COLLECTION).findOne({$or:[{Name:user.Name},{Email:user.Email}]})
                if(user.Name==collections.adminName||user.email==collections.adminEmail){
                    success=false
                    resolve(success)
                 }
                 else if(!isthere){
                    success=true
                    user.Password= await bcrypt.hash(user.Password,10)
                    db.get().collection('user').insertOne(user)
                    resolve(success)
                } 
                else{
                    success=false
                    resolve(success)
                }
               
            })
           
        // })
    },
    doLogin:(userData)=>{
        // Admin=false;
        let loginStatus=false;
        let response={};
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success")
                        response.user = user.Name
                        response.admin = false
                        response.status = true
                        resolve(response)
                    }

                    else{
                        console.log('login fail');
                        resolve(loginStatus)
                    }
                })

            
            }else if (userData.Password==admin.Password && userData.Email==admin.Email){
                    // Admin=true;
                    console.log("login failed,admin")
                    response.admin=true
                    response.user=false
                    resolve(response)
                }
            else{
                console.log('login failed')
                resolve({status:false})
            }
        })
    },
   
}