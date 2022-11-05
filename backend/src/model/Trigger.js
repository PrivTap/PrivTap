const mongoose = require('mongoose');
const Operation = require('./Operation');
const trigger = new mongoose.Schema({
    data:{
        //TODO: change this type
        type: String,
    },
    operation: {
        type: Operation
    }

},
    { collection: 'trigger' }
)
module.exports = mongoose.model('Trigger', trigger);