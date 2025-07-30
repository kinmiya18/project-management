// middlewares/checkProjectExists.js
const Project = require('../models/Project');

const checkProjectExists = async (req, res, next) => {
    const projectId = req.params.projectId;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        req.project = project; // đính kèm vào req để dùng sau
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error finding project',
            error: err.message
        });
    }
};

module.exports = checkProjectExists;
