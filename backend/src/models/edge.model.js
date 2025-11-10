import mongoose from "mongoose";

const EdgeScheme = new mongoose.Schema({
       projectId:{
            type: mongoose.Schema.Types.ObjectId,
             ref: 'Project'
        },
  id: { type: String},
  source: { type: String, required: true }, 
  target: { type: String, required: true }, 
  type: { type: String, default: "smoothstep" },
  label: { type: String },
  style: {
    stroke: { type: String },
    strokeWidth: { type: Number },
    opacity: { type: Number },
  },
  animated: { type: Boolean, default: false },
  data: {
    confidence: { type: Number },
    rationale: { type: String },
  },
});

export const Edge= mongoose.model('Edge',EdgeScheme);