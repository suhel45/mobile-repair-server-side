const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');



const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('hello node')
})
//user: mobiledb
//password: YuBXDeCkhzDJfXNM

const uri = "mongodb+srv://mobiledb:YuBXDeCkhzDJfXNM@cluster0.dwtnipt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const userCollection  = client.db("mobile").collection("services")
        app.get('/service',async(req,res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        })
    }
    finally{

    }

}
run().catch(e=>console.log(e))

app.listen(port,()=>{
    console.log(`server is running at port:${port}`)
})