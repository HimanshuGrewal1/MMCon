import { Project } from "../models/Project.modle.js";
import { Node } from "../models/node.modle.js";
import { Edge } from "../models/edge.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

 
export const createProject = async (req, res) => {
  try {
    console.log(req)
    const { title, description } = req.body;
    const owner = req.userId;
    console.log(req)

    if (!title || !description ) {
      throw new Error("All fields are required, including PDF");
    }

    // Upload the PDF file to Cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path, {
    //   resource_type: "raw", // required for PDFs
    //   folder: "projects_pdfs",
    // });

    // Delete the local temp file
    // fs.unlinkSync(req.file.path);

    // Save project with Cloudinary PDF link
    const project = new Project({
      owner,
      title,
      description,
  
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProjectsByUser = async (req, res) => {
    const owner = req.userId;
    try {
        const projects = await Project.find({ owner });
        res.status(200).json({
            success: true,
            projects
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getProject = async (req, res) => {
  const { projectId } = req.params;

  try {
   
    const Nodes = await Node.find({ projectId });
    const Edges = await Edge.find({ projectId });

  
    res.status(200).json({
      success: true,
      project: {
        Nodes,
        Edges,
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch project data.",
    });
  }
};


export const AddNote= async (req,res)=>{
    const {projectId}= req.params;
    const {position,data,type,style}= req.body;
    try {{
        const newNode= new Node({
            projectId,
          
            position,
            data,
            type,
            style
        });
        await newNode.save();
        res.status(201).json({
            success:true,
            message:"Node added successfully",
            newNode
        });
    }} catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}

export const AddEdge= async (req,res)=>{
    const {projectId}= req.params;
    const {id,source,target,data,type,label,style,animated}= req.body;
    try {{
        const newEdge= new Edge({
            projectId,
            id,
            source,
            target,
            type,
            label,
            style,
            animated,
            data
        });
        await newEdge.save();
        res.status(201).json({
            success:true,
            message:"Edge added successfully",
            newEdge
        });
    }} catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const EditNode= async (req,res)=>{
    const {projectId}= req.params;
    const {id,position,data,type,style}= req.body;
    try {{
        const updatedNode= await Node.findOneAndUpdate(
            { projectId, id },
            { position, data, type, style },
            { new: true }
        );
        if (!updatedNode) {
            throw new Error("Node not found");
        }
        res.status(200).json({
            success:true,
            message:"Node updated successfully",
            updatedNode
        });
    }} catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
