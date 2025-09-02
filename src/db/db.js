const mongoose = require('mongoose');

const connectToDb = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to the database successfully.")
    })
    .catch((error) => {
        console.log("Error connecting to the database:", error);
    })
}

module.exports = connectToDb