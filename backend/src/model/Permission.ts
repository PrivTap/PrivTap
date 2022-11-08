//define what is scope
import mongoose from 'mongoose';

const permission = new mongoose.Schema({
    scope: {
        type: String,
        required: true,
    },

},
    { collection: 'Permission' }
)

export default mongoose.model('Permission', permission);