const Project = require('../models/Project');
const { validationResult } = require('express-validator');

const projectController = {
    // Get all projects
    getAllProjects: async (req, res) => {
        try {
            const projects = await Project.find().sort({ createdAt: -1 });
            res.json({
                success: true,
                data: projects
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching projects',
                error: error.message
            });
        }
    },

    // Get project by ID
    getProjectById: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }
            res.json({
                success: true,
                data: project
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching project',
                error: error.message
            });
        }
    },

    // Create new project
    createProject: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }

            const { key, name } = req.body;

            // Check if project key already exists
            const existingProject = await Project.findOne({ key: key });
            if (existingProject) {
                return res.status(400).json({
                    success: false,
                    message: 'Project key already exists'
                });
            }

            const project = new Project({
                key: key,
                name: name.trim()
            });

            await project.save();

            res.status(201).json({
                success: true,
                message: 'Project created successfully',
                data: project
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating project',
                error: error.message
            });
        }
    },

    // Update project
    updateProject: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }

            const { key, name } = req.body;
            const projectId = req.params.id;

            // Check if project exists
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }

            // Check if new key conflicts with existing projects (excluding current)
            if (key && key.toUpperCase() !== project.key) {
                const existingProject = await Project.findOne({ 
                    key: key.toUpperCase(),
                    _id: { $ne: projectId }
                });
                if (existingProject) {
                    return res.status(400).json({
                        success: false,
                        message: 'Project key already exists'
                    });
                }
            }

            // Update project
            if (key) project.key = key.toUpperCase();
            if (name) project.name = name.trim();

            await project.save();

            res.json({
                success: true,
                message: 'Project updated successfully',
                data: project
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating project',
                error: error.message
            });
        }
    },

    // Delete project
    deleteProject: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }

            await Project.findByIdAndDelete(req.params.id);

            res.json({
                success: true,
                message: 'Project deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting project',
                error: error.message
            });
        }
    }
};

module.exports = projectController;