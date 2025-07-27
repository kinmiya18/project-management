const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    file_name: {
        type: String,
        required: true,
        trim: true
    },
    mount_point: {
        type: String,
        required: true,
        trim: true
    },
    file_content: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const projectSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    configs: [configSchema]
}, {
    timestamps: true
});

// Pre-save middleware to ensure key is lowercased
projectSchema.pre('save', function(next) {
    if (this.key) {
        this.key = this.key.toLowerCase();
    }
    next();
});

// Virtual for config count
projectSchema.virtual('configCount').get(function() {
    return this.configs.length;
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);