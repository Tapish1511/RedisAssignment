const express = require("express");
require("dotenv").config();
const client = require('./RedisClient');
const {ClientOperations, OrderOperations } = require("./Controllers/Operations")

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.post("/api/operations", async (req, res)=>{
    const MessageType = req.body.MsgType
    if(MessageType === 1121){
        const response = await ClientOperations(req.body);
        res.json(response);
    }

    else if(MessageType === 1120){
        const response = await OrderOperations(req.body);
        res.json(response);
    }

    else {
        res.json({success:false, message:"invalid msgtype"});
    }
})


app.get('/', (req, res)=>{
    res.json({message:"hey there"});
})

client.on("error", (err)=> console.log("redis error: ", err));

client.connect();

app.listen(process.env.PORT, ()=>{
    console.log("Server started");
});