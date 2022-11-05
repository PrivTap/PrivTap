//define what is scope
const mongoose = require('mongoose');
const permission = new mongoose.Schema({
    scope: {
        type: String,
        required: true,
    },

},
    { collection: 'Permission' }
)
module.exports = mongoose.model('Permission', permission);