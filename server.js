const app = require('./src/app');
require('dotenv').config(); // This is handled by Heroku config vars
const connectToDb = require('./src/db/db')

connectToDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})