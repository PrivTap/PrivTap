import mongoose from 'mongoose';
import Operation from './Operation';

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

export default mongoose.model('Action', action);