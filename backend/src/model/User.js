//Check how to hashify the password
//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
const mongoose = require('mongoose');
const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    }
    //TODO
    //array of all service for relation "manages" ?
    //array of all authorization for relation "authorizes" ?
},
    { collection: 'User' }
)
module.exports = mongoose.model('User', user);

