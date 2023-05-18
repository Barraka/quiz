require('dotenv').config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {MongoClient} = require('mongodb');
const mongoDb=process.env.MONGODB;

//Mongo connection
const client = new MongoClient(mongoDb);

async function getConnection(){
    await client.connect();
    const connection = client.db('blog');
    return connection;
}


//Mongoose connection

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const Question = mongoose.model(
    "Question",
    new Schema({
        _id: { type: String, required: false },
        question: { type: String, required: true },
        code: { type: String, required: false },
        answers: { type: Array, required: true },
        author: { type: String, required: true },
        submited: {type: Date, required: true },
    })
);


module.exports = {Question};