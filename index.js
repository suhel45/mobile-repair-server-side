const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');


console.log(process.env.DB_USER)



const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('hello node')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dwtnipt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const  verifyJWT = (req,res,next)=>{
    const authHeader = req.headers.authorizatio;
    if(!authHeader){
        res.send({message:'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN,function(err,decoded){
        if(err){res.send({message:'unauthorized access'})}
        req.decoded=decoded;
        next();
    })
}
async function run(){
    try{
        const userCollection  = client.db("mobile").collection("services")
        const userComment  = client.db("mobile").collection("comments")
        app.get('/service',async(req,res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })
        app.get('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await userCollection.findOne(query)
            res.send(result)
        })
        app.post('/users',async(req,res)=>{
            const user = req.body;
            const resul = await userComment.insertOne(user)
            console.log(user);
        })
        app.get('/comment',verifyJWT,async(req,res)=>{
            const query = {};
            const cursor = userComment.find(query);
            const rest = await cursor.toArray();
            res.send(rest);
        })
        app.get('/comment/:id',async(req,res)=>{
            let id = req.params.id;
           let query = {id:id}
           const cursor = userComment.find(query)
           let resu = await cursor.toArray();
            res.send(resu);
        })
        app.delete('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const cmt = await userComment.deleteOne(query);
            console.log(id)
            res.send(cmt);
        })
        app.post('/jwt',(req,res)=>{
            const usr = req.body;
            const token = jwt.sign(usr,process.env.ACCESS_TOKEN,{expiresIn:'1h'})
            res.send({token})
        })
    }
    finally{

    }

}
run().catch(e=>console.log(e))

app.listen(port,()=>{
    console.log(`server is running at port:${port}`)
})