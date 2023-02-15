const  mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const {MongoClient}= require('mongodb');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// Mongo db conf
const dbRoute = "mongodb://127.0.0.1:27017/perry_db"

// connecting backend code with the database
mongoose.connect(dbRoute,{useNewUrlParser:true});

let db =mongoose.connection;

db.once('open',()=> console.log('Connected to the database'));

// check if connection with the database is successful
db.on('error',console.error.bind(console,"MongoDb coneection error:"));

// For logging and bodyParser to make the request in Json format
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(logger('dev'));

// get method that fetches all data in the database
router.get('/getData',(req,res)=>{
    Data.find((err,data)=>{
    if (err) return res.json({success:false,error:err});
    return res.json({success:true,data:data});
});
});
// our update method,overwrites a record in the database
router.post('/updateData',(req,res)=>{
    const{id,update }=req.body;
    Data.findByIdAndUpdate(id,update, (err) =>{
        if (err) return res.json({success:false,error:err});
        return res.json({success:true});


    });
});

// Delete method
router.delete('/deleteData',(req,res)=>{
    const {id} = req.body;
    Data.findByIdAndUpdate(id,(err)=>{
        if (err) return res.send(err);
        return res.json({success:true});
    });
});

// Create a new data/record in the database

router.post('/putData', (req,res)=>{
    let data = newData();
    const{id,message} =req.body;
    if ((!id && id !== 0) || !message){
        return res.json({
            success:false,
            error:"invalid inputs",
        });

    }
    data.mssage =message;
    data.id = id;
    data.save((err)=>{
        if (err) return res.json({
            success:false,error:err
        });
        return res.json({sucess:true})
    });
});

// append apis endpoint to our http requests
app.use('/api',router);

// Launch backend into a port
app.listen (API_PORT,()=> console.log(`Listening on port ${API_PORT}`));