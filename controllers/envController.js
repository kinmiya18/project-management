const Project = require('../models/Project');
const { validationResult } = require('express-validator');

const envController = {
    // Add env to project
    addEnv: async (req, res) => {
        try {
            const { name, value } = req.body;
            const project = req.project;

            // Check if env with same name already exists
            const existingEnv = project.envs.find(
                env => env.name === name
            );
            if (existingEnv) {
                return res.status(400).json({
                    success: false,
                    message: 'Environment variable with this name already exists'
                });
            }

            const newEnv = {
                name: name.trim(),
                value: value.trim()
            };

            project.envs.push(newEnv);
            await project.save();

            res.status(201).json({
                success: true,
                message: 'Environment variable added successfully',
                data: project.envs[project.envs.length - 1]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error adding environment variable',
                error: error.message
            });
        }
    },

    // Update env
    updateEnv: async (req, res) => {
        try {
            const { name, value } = req.body;
            const { envId } = req.params;
            const project = req.project;

            const env = project.envs.id(envId);
            if (!env) {
                return res.status(404).json({
                    success: false,
                    message: 'Environment variable not found'
                });
            }

            // Check if new name conflicts with existing envs (excluding current)
            if (name && name !== env.name) {
                const existingEnv = project.envs.find(
                    e => e.name === name && e._id.toString() !== envId
                );
                if (existingEnv) {
                    return res.status(400).json({
                        success: false,
                        message: 'Environment variable with this name already exists'
                    });
                }
            }

            if (name) env.name = name.trim();
            if (value !== undefined) env.value = value.trim();

            await project.save();

            res.json({
                success: true,
                message: 'Environment variable updated successfully',
                data: env
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating environment variable',
                error: error.message
            });
        }
    },

    // Delete env
    deleteEnv: async (req, res) => {
        try {
            const { envId } = req.params;
            const project = req.project;

            const env = project.envs.id(envId);
            if (!env) {
                return res.status(404).json({
                    success: false,
                    message: 'Environment variable not found'
                });
            }

            project.envs.pull(envId);
            await project.save();

            res.json({
                success: true,
                message: 'Environment variable deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting environment variable',
                error: error.message
            });
        }
    },

    // Get env by ID
    getEnv: async (req, res) => {
        try {
            const { envId } = req.params;
            const project = req.project;

            const env = project.envs.id(envId);
            if (!env) {
                return res.status(404).json({
                    success: false,
                    message: 'Environment variable not found'
                });
            }

            res.json({
                success: true,
                data: env
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching environment variable',
                error: error.message
            });
        }
    }
};

module.exports = envController;
