import mongoose from 'mongoose';
import Operation from './Operation';

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

export default mongoose.model('Trigger', trigger);