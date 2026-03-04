const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

const questions = [
    {
        questionText: "How are you feeling today?",
        options: ["Happy", "Sad", "Excited", "Tired"]
    },
    {
        questionText: "What kind of music do you like?",
        options: ["Pop", "Rock", "Jazz", "Classical"]
    }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected');
        await Question.deleteMany();  
        await Question.insertMany(questions);
        console.log('Questions added!');
        mongoose.disconnect();
    })
    .catch(err => console.log(err));