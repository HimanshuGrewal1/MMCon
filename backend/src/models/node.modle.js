import mongoose from "mongoose";

const NodeScheme = new mongoose.Schema({
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Project'
    },
  id: { type: String, required: true, unique: true },
  data: {
    label: { type: String, required: true },
    content: { type: String, required: true },
    confidence: { type: Number, required: true },
    type: { type: String, required: true },
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  type: { type: String, default: "default" },
  style: {
    backgroundColor: { type: String },
    color: { type: String },
    fontWeight: { type: String },
    border: { type: String },
    padding: { type: Number },
    borderRadius: { type: Number },
    width: { type: Number },
    textAlign: { type: String },
    opacity: { type: Number },
  },
});


export const Node= mongoose.model('Node',NodeScheme);