import mongoose from "mongoose";

const ProjectScheme= new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },
    title:{
        type: String,
        required : true,
    },
    description:{
        type: String,
        required : true
    },
    pdflink:{
        type: String,
        required : true
    }
},{timestamps: true})

export const Project= mongoose.model('Project',ProjectScheme);