const redis = require("redis");
const client = redis.createClient();
client.on("error", function(error) {
    console.error(error);
  });

//redis://localhost:6379

const setJWT=(key,value)=>{
    return new Promise((resolve,reject)=>{
    try {
        client.set(key,value,(err,res)=>{
            if(err) reject(err)
            resolve(res)
        })
        
    } catch (error) {
        reject(error)}
        
    })
}
const getJWT=(key)=>{
    
    return Promise((resolve,reject)=>{
        try {
            client.get("key", (err,res)=>{
                if(err) reject(err)
                resolve(res)
            })
            
        } catch (error) {
            reject(error)}
            
        })
    }
    module.exports=
    {
        setJWT,getJWT
    }