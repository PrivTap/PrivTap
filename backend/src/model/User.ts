//Check how to hashify the password
// We can use bcrypt JS library
//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
import mongoose from 'mongoose';

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

export default mongoose.model('User', user);

