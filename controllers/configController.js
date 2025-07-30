const Project = require('../models/Project');

const configController = {
    // Add config to project
    addConfig: async (req, res) => {
        try {
            const { file_name, mount_point, file_content } = req.body;
            const project = req.project;

            // Check if config with same file_name already exists
            const existingConfig = project.configs.find(
                config => config.file_name === file_name
            );
            if (existingConfig) {
                return res.status(400).json({
                    success: false,
                    message: 'Config file with this name already exists'
                });
            }

            const newConfig = {
                file_name: file_name.trim(),
                mount_point: mount_point.trim(),
                file_content: file_content || ''
            };

            project.configs.push(newConfig);
            await project.save();

            res.status(201).json({
                success: true,
                message: 'Config added successfully',
                data: project.configs[project.configs.length - 1]
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error adding config',
                error: error.message
            });
        }
    },

    // Update config
    updateConfig: async (req, res) => {
        try {
            const { file_name, mount_point, file_content } = req.body;
            const { projectId, configId } = req.params;
            const project = req.project;

            const config = project.configs.id(configId);
            if (!config) {
                return res.status(404).json({
                    success: false,
                    message: 'Config not found'
                });
            }

            // Check if new file_name conflicts with existing configs (excluding current)
            if (file_name && file_name !== config.file_name) {
                const existingConfig = project.configs.find(
                    c => c.file_name === file_name && c._id.toString() !== configId
                );
                if (existingConfig) {
                    return res.status(400).json({
                        success: false,
                        message: 'Config file with this name already exists'
                    });
                }
            }

            // Update config
            if (file_name) config.file_name = file_name.trim();
            if (mount_point) config.mount_point = mount_point.trim();
            if (file_content !== undefined) config.file_content = file_content;

            await project.save();

            res.json({
                success: true,
                message: 'Config updated successfully',
                data: config
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating config',
                error: error.message
            });
        }
    },

    // Delete config
    deleteConfig: async (req, res) => {
        try {
            const { projectId, configId } = req.params;

            const project = req.project;

            const config = project.configs.id(configId);
            if (!config) {
                return res.status(404).json({
                    success: false,
                    message: 'Config not found'
                });
            }

            project.configs.pull(configId);
            await project.save();

            res.json({
                success: true,
                message: 'Config deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting config',
                error: error.message
            });
        }
    },

    // Get config by ID
    getConfig: async (req, res) => {
        try {
            const { projectId, configId } = req.params;

            const project = req.project;
            const config = project.configs.id(configId);
            if (!config) {
                return res.status(404).json({
                    success: false,
                    message: 'Config not found'
                });
            }

            res.json({
                success: true,
                data: config
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching config',
                error: error.message
            });
        }
    }
};

module.exports = configController;