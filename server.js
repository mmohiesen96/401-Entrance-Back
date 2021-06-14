'use strict'

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');


const server = express();

server.use(express.json());
server.use(cors());
mongoose.connect('mongodb://localhost:27017/digimon',{ useNewUrlParser: true, useUnifiedTopology: true });


const digimon = new mongoose.Schema({
    name:String,
    img:String,
    level:String
})

const digimonModel = mongoose.model('digimons' , digimon)


const PORT = process.env.PORT;
server.get('/getdigimons' , getDigi);
server.get('/getfavorite' , getFav);
server.post('/addtofavorite' , addToFav);
server.delete('/delete/:id' , deleteDigi);
server.put('/update/:id' , updateDigi);
server.get('/' , (req,res) => {
    res.send('Home root');
})

function getDigi (req , res) {
    const url = 'https://digimon-api.vercel.app/api/digimon';
    axios.get(url).then(result => {
        res.send(result.data);
    })
}

function addToFav (req,res) {
    const {name , img , level} = req.body;
    const newDigimon = new digimonModel ({
        name:name,
        img : img,
        level:level
    })
    newDigimon.save();
}
function getFav (req,res) {
    digimonModel.find({} , (err,data) => 
    {
        res.send(data);
    })
}

function deleteDigi (req,res) {
    const id = req.params.id;
    digimonModel.findByIdAndDelete(id , (err,data) => {
        digimonModel.find({} , (err,newData) => {
            res.send(newData)
        })
    })
}


function updateDigi (req , res) {
    digimonModel.find({} , (err , data) => {
        data.map((item,idx) => {
            if(idx == req.params.id){
                item.img = req.body.img;
                item.name = req.body.name;
                item.level = req.body.level;
                item.save()
            }
        })
        res.send(data);
    })
}
server.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
})
