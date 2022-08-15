var db=require('../config/connection')
var collections=require('../config/collections')
const { response } = require('../app')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectId

module.exports={

    addProduct:(user)=>{

        // db.get().collection('user').insertOne(user).then((data)=>{
        //     callback(data._id)
        // })


    //     return new Promise(async(resolve,reject)=>{
    //     user.Password = await bcrypt.hash(user.Password,10)
    //     db.get().collection(collections.USER_COLLECTION).insertOne(user).then((data)=>{
    //         resolve(user)
    //     })
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


    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collections.USER_COLLECTION).find().toArray()
            resolve(user)
        })
    },
    deleteUser:(UserId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).deleteOne({_id:objectId(UserId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    getUserDetails:(UserId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).findOne({_id:objectId(UserId)}).then((user)=>{
                resolve(user)
            })
        })
    },
    updateUser:(userId,userDetials)=>{
        return new Promise(async(resolve,reject)=>{
            userDetials.Password = await bcrypt.hash(userDetials.Password,10)
            db.get().collection(collections.USER_COLLECTION).updateOne({_id:objectId(userId)},
            {
                $set:{
                    Name:userDetials.Name,
                    Email:userDetials.Email,
                    Password:userDetials.Password
                }
            }).then((response)=>{
                resolve()
            })
        })
    }

}
