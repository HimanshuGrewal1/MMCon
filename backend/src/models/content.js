import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
    },

  body: { type: String, required: true },

})

export const Content = mongoose.model('Content', ContentSchema);