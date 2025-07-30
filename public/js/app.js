// Global variables
let projects = [];
let currentProject = null;
let editingConfigId = null;
let editingProjectId = null;
let editingEnvId = null;

// DOM elements
const dashboardView = document.getElementById('dashboardView');
const projectDetailView = document.getElementById('projectDetailView');
const configModal = document.getElementById('configModal');
const projectModal = document.getElementById('projectModal');
const fileContentModal = document.getElementById('fileContentModal');
const envModal = document.getElementById('envModal');
const projectsGrid = document.getElementById('projectsGrid');
const projectInfo = document.getElementById('projectInfo');
const configTable = document.getElementById('configTable');
const envTable = document.getElementById('envTable');
const loadingIndicator = document.getElementById('loadingIndicator');

// API functions
const API = {
    // Project endpoints
    getProjects: async () => {
        const response = await fetch('/api/projects');
        return await response.json();
    },

    getProject: async (projectId) => {
        const response = await fetch(`/api/projects/${projectId}`);
        return await response.json();
    },

    createProject: async (data) => {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    updateProject: async (projectId, data) => {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    deleteProject: async (projectId) => {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    // Config endpoints
    addConfig: async (projectId, data) => {
        const response = await fetch(`/api/configs/${projectId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    updateConfig: async (projectId, configId, data) => {
        const response = await fetch(`/api/configs/${projectId}/${configId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    deleteConfig: async (projectId, configId) => {
        const response = await fetch(`/api/configs/${projectId}/${configId}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    // Environment variables endpoints
    addEnv: async (projectId, data) => {
        const response = await fetch(`/api/envs/${projectId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    updateEnv: async (projectId, envId, data) => {
        const response = await fetch(`/api/envs/${projectId}/${envId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    deleteEnv: async (projectId, envId) => {
        const response = await fetch(`/api/envs/${projectId}/${envId}`, {
            method: 'DELETE'
        });
        return await response.json();
    }
};

// Utility functions
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showNotification(title, message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notificationIcon');
    const titleEl = document.getElementById('notificationTitle');
    const messageEl = document.getElementById('notificationMessage');

    // Set icon based on type
    if (type === 'success') {
        icon.innerHTML = '<i class="fas fa-check-circle text-green-500 text-xl"></i>';
    } else if (type === 'error') {
        icon.innerHTML = '<i class="fas fa-exclamation-circle text-red-500 text-xl"></i>';
    } else {
        icon.innerHTML = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>';
    }

    titleEl.textContent = title;
    messageEl.textContent = message;

    notification.classList.remove('hidden');

    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Initialize app
async function init() {
    await loadProjects();
    setupEventListeners();
}

// Load projects from API
async function loadProjects() {
    try {
        showLoading();
        const response = await API.getProjects();
        if (response.success) {
            projects = response.data;
            renderProjects();
        } else {
            showNotification('Lỗi', 'Không thể tải danh sách projects', 'error');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
        hideLoading();
    }
}

// Render projects grid
function renderProjects() {
    if (!projects.length) {
        projectsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-project-diagram text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có project nào</h3>
                <p class="text-gray-500 mb-4">Bắt đầu bằng cách tạo project đầu tiên của bạn</p>
                <button onclick="showProjectModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <i class="fas fa-plus mr-2"></i>Tạo Project
                </button>
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = projects.map(project => `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">${escapeHtml(project.name)}</h3>
                    <p class="text-sm text-gray-500">Key: ${escapeHtml(project.key)}</p>
                </div>
                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    ${project.port_host || 'N/A'}:${project.port_container || 'N/A'}
                </span>
            </div>
            <div class="flex justify-end space-x-2">
                <button onclick="viewProject('${project._id}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <i class="fas fa-eye mr-1"></i>Chi tiết
                </button>
                <button onclick="editProject('${project._id}')" class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <i class="fas fa-edit mr-1"></i>Sửa
                </button>
                <button onclick="deleteProject('${project._id}')" class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <i class="fas fa-trash mr-1"></i>Xóa
                </button>
            </div>
        </div>
    `).join('');
}

// View project details
async function viewProject(projectId) {
    try {
        showLoading();
        const response = await API.getProject(projectId);
        if (response.success) {
            currentProject = response.data;
            
            // Update project info
            projectInfo.innerHTML = `
                <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">Key</div>
                    <div class="text-lg font-semibold text-gray-900">${escapeHtml(currentProject.key)}</div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">Name</div>
                    <div class="text-lg font-semibold text-gray-900">${escapeHtml(currentProject.name)}</div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">Port Host</div>
                    <div class="text-lg font-semibold text-gray-900">${escapeHtml(currentProject.port_host || 'N/A')}</div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-500 mb-1">Port Container</div>
                    <div class="text-lg font-semibold text-gray-900">${escapeHtml(currentProject.port_container || 'N/A')}</div>
                </div>
            `;

            renderConfigTable();
            renderEnvTable();
            showView('detail');
        } else {
            showNotification('Lỗi', 'Không thể tải thông tin project', 'error');
        }
    } catch (error) {
        console.error('Error viewing project:', error);
        showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
        hideLoading();
    }
}

// Render config table
function renderConfigTable() {
    if (!currentProject.configs.length) {
        configTable.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-file-code text-4xl mb-2 text-gray-300"></i>
                    <div>Chưa có file cấu hình nào</div>
                </td>
            </tr>
        `;
        return;
    }

    configTable.innerHTML = currentProject.configs.map((config) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <i class="fas fa-file-code text-blue-500 mr-3"></i>
                    <button onclick="viewFileContent('${config._id}')" class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">${escapeHtml(config.file_name)}</button>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-600 font-mono">${escapeHtml(config.mount_point)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editConfig('${config._id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit mr-1"></i>Edit
                </button>
                <button onclick="deleteConfig('${config._id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash mr-1"></i>Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

// Render environment variables table
function renderEnvTable() {
    if (!currentProject.envs || !currentProject.envs.length) {
        envTable.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-code text-4xl mb-2 text-gray-300"></i>
                    <div>Chưa có biến môi trường nào</div>
                </td>
            </tr>
        `;
        return;
    }

    envTable.innerHTML = currentProject.envs.map((env) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <i class="fas fa-code text-green-500 mr-3"></i>
                    <span class="text-sm font-medium text-gray-900">${escapeHtml(env.name)}</span>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="text-sm text-gray-600 font-mono break-words">${escapeHtml(env.value)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editEnv('${env._id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit mr-1"></i>Edit
                </button>
                <button onclick="deleteEnv('${env._id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash mr-1"></i>Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

// Show/hide views
function showView(view) {
    if (view === 'dashboard') {
        dashboardView.classList.remove('hidden');
        projectDetailView.classList.add('hidden');
    } else {
        dashboardView.classList.add('hidden');
        projectDetailView.classList.remove('hidden');
    }
}

// Modal functions
function showModal(title = 'Thêm Config Mới') {
    document.getElementById('modalTitle').textContent = title;
    configModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    configModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('configForm').reset();
    editingConfigId = null;
}

function showProjectModal() {
    projectModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideProjectModal() {
    projectModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('projectForm').reset();
    document.getElementById('projectModalTitle').textContent = 'Thêm Project Mới';
    editingProjectId = null;
}

function showEnvModal(title = 'Thêm Biến Môi Trường Mới') {
    document.getElementById('envModalTitle').textContent = title;
    envModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideEnvModal() {
    envModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('envForm').reset();
    editingEnvId = null;
}

function showFileContentModal() {
    fileContentModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideFileContentModal() {
    fileContentModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Config operations
function addConfig() {
    editingConfigId = null;
    showModal('Thêm Config Mới');
}

function editConfig(configId) {
    editingConfigId = configId;
    const config = currentProject.configs.find(c => c._id === configId);
    
    if (config) {
        document.getElementById('fileName').value = config.file_name;
        document.getElementById('mountPoint').value = config.mount_point;
        document.getElementById('fileContent').value = config.file_content || '';
        
        showModal('Chỉnh sửa Config');
    }
}

async function deleteConfig(configId) {
    if (confirm('Bạn có chắc chắn muốn xóa config này?')) {
        try {
            showLoading();
            const response = await API.deleteConfig(currentProject._id, configId);
            if (response.success) {
                showNotification('Thành công', 'Đã xóa config thành công');
                await viewProject(currentProject._id);
            } else {
                showNotification('Lỗi', response.message || 'Không thể xóa config', 'error');
            }
        } catch (error) {
            console.error('Error deleting config:', error);
            showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
        } finally {
            hideLoading();
        }
    }
}

async function saveConfig(event) {
    event.preventDefault();
    
    const fileName = document.getElementById('fileName').value.trim();
    const mountPoint = document.getElementById('mountPoint').value.trim();
    const fileContent = document.getElementById('fileContent').value;

    const configData = {
        file_name: fileName,
        mount_point: mountPoint,
        file_content: fileContent
    };

    try {
        showLoading();
        let response;
        
        if (editingConfigId) {
            response = await API.updateConfig(currentProject._id, editingConfigId, configData);
        } else {
            response = await API.addConfig(currentProject._id, configData);
        }

        if (response.success) {
            const action = editingConfigId ? 'cập nhật' : 'thêm';
            showNotification('Thành công', `Đã ${action} config thành công`);
            hideModal();
            await viewProject(currentProject._id);
        } else {
            showNotification('Lỗi', response.message || 'Không thể lưu config', 'error');
        }
    } catch (error) {
        console.error('Error saving config:', error);
        showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
        hideLoading();
    }
}

// Environment variables operations
function addEnv() {
    editingEnvId = null;
    showEnvModal('Thêm Biến Môi Trường Mới');
}

function editEnv(envId) {
    editingEnvId = envId;
    const env = currentProject.envs.find(e => e._id === envId);
    
    if (env) {
        document.getElementById('envName').value = env.name;
        document.getElementById('envValue').value = env.value;
        
        showEnvModal('Chỉnh sửa Biến Môi Trường');
    }
}

async function deleteEnv(envId) {
    if (confirm('Bạn có chắc chắn muốn xóa biến môi trường này?')) {
        try {
            showLoading();
            const response = await API.deleteEnv(currentProject._id, envId);
            if (response.success) {
                showNotification('Thành công', 'Đã xóa biến môi trường thành công');
                await viewProject(currentProject._id);
            } else {
                showNotification('Lỗi', response.message || 'Không thể xóa biến môi trường', 'error');
            }
        } catch (error) {
            console.error('Error deleting env:', error);
            showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
        } finally {
            hideLoading();
        }
    }
}

async function saveEnv(event) {
    event.preventDefault();
    
    const envName = document.getElementById('envName').value.trim();
    const envValue = document.getElementById('envValue').value.trim();

    const envData = {
        name: envName,
        value: envValue
    };

    try {
        showLoading();
        let response;
        
        if (editingEnvId) {
            response = await API.updateEnv(currentProject._id, editingEnvId, envData);
        } else {
            response = await API.addEnv(currentProject._id, envData);
        }

        if (response.success) {
            const action = editingEnvId ? 'cập nhật' : 'thêm';
            showNotification('Thành công', `Đã ${action} biến môi trường thành công`);
            hideEnvModal();
            await viewProject(currentProject._id);
        } else {
            if (response.errors && response.errors.length > 0) {
                const errorMessages = response.errors.map(e => `${e.msg}`).join('\n');
                showNotification('Lỗi', errorMessages, 'error');
            } else {
                showNotification('Lỗi', response.message || 'Không thể lưu biến môi trường', 'error');
            }
        }
    } catch (error) {
        console.error('Error saving env:', error);
        showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
        hideLoading();
    }
}

// Project operations
function editProject(projectId) {
    editingProjectId = projectId;
    const project = projects.find(p => p._id === projectId);
    if (!project) return;

    document.getElementById('projectName').value = project.name;
    document.getElementById('projectKey').value = project.key;
    document.getElementById('portHost').value = project.port_host || '';
    document.getElementById('portContainer').value = project.port_container || '';
    document.getElementById('projectModalTitle').textContent = 'Chỉnh sửa Project';

    showProjectModal();
}

async function deleteProject(projectId) {
    const project = projects.find(p => p._id === projectId);
    if (!project) return;

    if (confirm(`Bạn có chắc chắn muốn xóa project "${project.name}"?`)) {
        try {
            showLoading();
            const response = await API.deleteProject(projectId);
            if (response.success) {
                showNotification('Thành công', 'Đã xóa project thành công');
                await loadProjects();
                
                if (currentProject && currentProject._id === projectId) {
                    showView('dashboard');
                }
            } else {
                showNotification('Lỗi', response.message || 'Không thể xóa project', 'error');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
        } finally {
            hideLoading();
        }
    }
}

function viewFileContent(configId) {
    const config = currentProject.configs.find(c => c._id === configId);
    if (!config) return;

    document.getElementById('fileContentTitle').textContent = `Nội dung file: ${config.file_name}`;
    document.getElementById('fileContentDisplay').textContent = config.file_content || 'File không có nội dung';
    
    showFileContentModal();
}

async function saveProject(event) {
    event.preventDefault();
    
    const projectName = document.getElementById('projectName').value.trim();
    const projectKey = document.getElementById('projectKey').value.trim();
    const projectPortHost = document.getElementById('portHost').value.trim();
    const projectPortContainer = document.getElementById('portContainer').value.trim();

    const projectData = {
        name: projectName,
        key: projectKey,
        port_host: projectPortHost,
        port_container: projectPortContainer
    };

    try {
        showLoading();
        let response;
        
        if (editingProjectId) {
            response = await API.updateProject(editingProjectId, projectData);
        } else {
            response = await API.createProject(projectData);
        }

        if (response.success) {
            const action = editingProjectId ? 'cập nhật' : 'tạo';
            showNotification('Thành công', `Đã ${action} project thành công`);
            hideProjectModal();
            await loadProjects();
            
            if (editingProjectId && currentProject && currentProject._id === editingProjectId) {
                await viewProject(editingProjectId);
            }
        } else {
            if (response.errors && response.errors.length > 0) {
                const errorMessages = response.errors.map(e => `${e.msg}`).join('\n');
                showNotification('Lỗi', errorMessages, 'error');
            } else {
                showNotification('Lỗi', response.message || 'Không thể lưu project', 'error');
            }
        }
    } catch (error) {
        console.error('Error saving project:', error);
        showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
        hideLoading();
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (typeof text !== 'string') {
        text = String(text ?? '');
    }
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('dashboardBtn').addEventListener('click', () => showView('dashboard'));
    document.getElementById('backToDashboard').addEventListener('click', () => showView('dashboard'));
    
    // Config operations
    document.getElementById('addConfigBtn').addEventListener('click', addConfig);
    document.getElementById('closeModal').addEventListener('click', hideModal);
    document.getElementById('cancelBtn').addEventListener('click', hideModal);
    document.getElementById('configForm').addEventListener('submit', saveConfig);

    // Environment variables operations
    document.getElementById('addEnvBtn').addEventListener('click', addEnv);
    document.getElementById('closeEnvModal').addEventListener('click', hideEnvModal);
    document.getElementById('cancelEnvBtn').addEventListener('click', hideEnvModal);
    document.getElementById('envForm').addEventListener('submit', saveEnv);

    // Project operations
    document.getElementById('addProjectBtn').addEventListener('click', () => {
        editingProjectId = null;
        document.getElementById('projectModalTitle').textContent = 'Thêm Project Mới';
        showProjectModal();
    });
    document.getElementById('closeProjectModal').addEventListener('click', hideProjectModal);
    document.getElementById('cancelProjectBtn').addEventListener('click', hideProjectModal);
    document.getElementById('projectForm').addEventListener('submit', saveProject);

    // File content modal
    document.getElementById('closeFileContentModal').addEventListener('click', hideFileContentModal);

    // Close modals on backdrop click
    configModal.addEventListener('click', (e) => {
        if (e.target === configModal) hideModal();
    });

    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) hideProjectModal();
    });

    fileContentModal.addEventListener('click', (e) => {
        if (e.target === fileContentModal) hideFileContentModal();
    });

    envModal.addEventListener('click', (e) => {
        if (e.target === envModal) hideEnvModal();
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!configModal.classList.contains('hidden')) {
                hideModal();
            } else if (!projectModal.classList.contains('hidden')) {
                hideProjectModal();
            } else if (!fileContentModal.classList.contains('hidden')) {
                hideFileContentModal();
            } else if (!envModal.classList.contains('hidden')) {
                hideEnvModal();
            }
        }
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);