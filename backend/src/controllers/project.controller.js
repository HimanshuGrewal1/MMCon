import { Project } from "../models/Project.modle.js";
import { Node } from "../models/node.modle.js";
import { Edge } from "../models/edge.model.js";

export const createProject = async (req, res) => {
    const { title, description, pdflink } = req.body;
    const owner = req.userId;
    try {
        if (!title || !description || !pdflink) {
            throw new Error("All fields are required");
        }
        const project = new Project({
            owner,
            title,
            description,
            pdflink
        });
        await project.save();
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });
    } catch (error) {
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

export const getProject=async (req,res) => {
   const {projectId}=req.params
    try {
        const Nodes=Node.find({projectId})
        const Edges=Edge.find({projectId})
        res.status(200).json({
            success: true,
            project:{
                Nodes,
                Edges
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }


    
}