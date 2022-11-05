const mongoose = require('mongoose');
const service = new mongoose.Schema({
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
    authServer: {
        type: String,
    
    },
    clientId: {
        type: String
    },
    secret: {
        type: String
    }
},
    { collection: 'Service' }
)
module.exports = mongoose.model('Service', service);