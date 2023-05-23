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

const Result = mongoose.model(
    "Result",
    new Schema({
        user: { type: String, required: true },
        score: { type: Number, required: true },
        timer: { type: Number, required: true },
    })
);

const User = mongoose.model(
    "User",
    new Schema({
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        admin: { type: Boolean, required: true },
        joined: {type: Date, required: true },
        provider: {type: String, required: true },
        googleID: {type: String, required: false },
    })
);

const PendingQuiz = mongoose.model(
    "PendingQuiz",
    new Schema({
        email: { type: String, required: true },
        started: { type: Date, required: true },
        questionsID: {type: Array, required: true },
        questionsTimestamp: {type: Array, required: true },
        answersTimestamp: {type: Array, required: true },
        score: {type: Array, required: true },
    })
);


module.exports = {Question, Result, User, PendingQuiz};