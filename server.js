/********************************************************************************* 
 * WEB422 – Assignment 1 *
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 * (including web sites) or distributed to other students. 
 *  
 * Name:Khoi Vu Student ID: 124611203 Date: September 14th 2022 
 * Cyclic Link: _______________________________________________________________ 
 ********************************************************************************/

const express = require("express");
const cors = require("cors")
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

require('dotenv').config();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

app.get("/", (req,res) => {
    res.json({message: "API Listening"});
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`Server listening on: ${HTTP_PORT}`);
    });
    }).catch((err)=>{
    console.log(err);
});

app.post("/api/movies", async (req, res) => {
    try {
        await db.addNewMovie(req.body);
        res.status(201).json({message: "Movie created"});
    } catch(err) {
        res.status(404).json({message: err})
    }
});

// I improved the logic so that if a movie doesnt exist, it will display the appropriate message
app.get("/api/movies", async (req, res) => {
    try {
        let data = await db.getAllMovies(req.query.page, req.query.perPage, req.query.title);
        if (data.length) {
            res.json(data);
        }
        else {
            res.json({message: `There is no movie with the title: ${req.query.title}`});
        }
    } catch(err) {
        res.json({message: err}).status(404);
    }
});

// I improved the logic so that if a movie doesnt exist, it will display the appropriate message
app.get("/api/movies/:id", async (req, res) => {
    try {
        let data = await db.getMovieById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.json({message: `There is no movie with the id: ${req.params.id}`});
        }
    } catch(err) {
        res.status(404).json({message: err});
    }
});

// I improved the logic so that if a movie doesnt exist, it will display the appropriate message
app.put("/api/movies/:id", async (req,res) => {
    try {
        let data = await db.updateMovieById(req.body, req.params.id);
        if (data.modifiedCount == 1) {
            res.json({message: `Movie with id: ${req.params.id} updated`})
        } else {
            res.json({message: `There is no movie with the id: ${req.params.id}`});
        }
    } catch(err){
        res.status(404).json({message:err})
    }
})

// I improved the logic so that if a movie doesnt exist, it will display the appropriate message
app.delete("/api/movies/:id", async (req,res) => {
    try {
        let data = await db.deleteMovieById(req.params.id);
        if (data.deletedCount == 1) {
            res.json({message: `Deleted movie with id: ${req.params.id}`});
        } else {
            res.json({message: `There is no movie with the id: ${req.params.id}`});
        }
    }catch(err){
        res.status(404).json({message:err})
    } 
})

