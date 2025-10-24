import mongoose from "mongoose";

const ProjectScheme= new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },
    pdflink:{
        type: String,
        required : true
    }
},{timestamps: true})