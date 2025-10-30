import mongoose from "mongoose";

const EdgeScheme= new mongoose.Schema({
    ProjectId:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
    },
    fromNode:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Node'
    },
    toNode:{    
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Node'
    }
})

export const Edge= mongoose.model('Edge',EdgeScheme);