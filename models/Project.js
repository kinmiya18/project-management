const mongoose = require('mongoose');

const envSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    }
}, {
    _id: true // Mỗi env sẽ có id riêng
});

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
    port_host: {
        type: Number,
        required: true
    },
    port_container: {
        type: Number,
        required: true
    },
    configs: [configSchema],
    envs: [envSchema]
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

module.exports = mongoose.model('Project', projectSchema);