const mongoose = require('mongoose');
const operation = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    //this is the object id of the service -> check if it's the best way to translate a one too many relation
    service: {
        type: String
    },
    permission: {
        type: Array
    }

},
    { collection: 'Operation' }
)
module.exports = mongoose.model('Operation', operation);