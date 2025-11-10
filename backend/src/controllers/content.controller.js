import {Content} from "../models/content.js"

export const createContent = async (req, res) => {
    const { projectId } = req.params;
    const { body } = req.body;
    try {
        const newContent = new Content({
            projectId,
            body
        });
        await newContent.save();
        res.status(201).json({
            success: true,
            message: "Content created successfully",
            newContent
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const getContentByProjectId = async (req, res) => {
    const { projectId } = req.params;
    try {
        const contents = await Content.find({ projectId });
        res.status(200).json({
            success: true,
            contents
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}