import mongoose from "mongoose";

const NodeScheme= new mongoose.Schema({
    ProjectId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Project'
    },
    name:{
        type: String,
        required : true,
    },
    content:{
        type: String,
        required : true
    }
})


export const Node= mongoose.model('Node',NodeScheme);