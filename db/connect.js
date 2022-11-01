const mongoose = require('mongoose');
const DB = process.env.DATABASE;

//connecting to monoDB database

mongoose.connect(DB, {
    useNewUrlParser : true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Successfully connected to the database");    
}).catch( (err) => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});