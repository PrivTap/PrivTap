const mongoose = require('mongoose');
const Operation = require('./Operation');
const action = new mongoose.Schema({
    data:{
        //TODO: change this type
        type: String,
    },
    operation: {
        type: Operation
    }

},
    { collection: 'action' }
)
module.exports = mongoose.model('Action', action);