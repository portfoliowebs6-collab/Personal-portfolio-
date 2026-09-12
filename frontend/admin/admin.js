const API_URL = 'http://localhost:5000/api';

const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Check Login Status on Load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
    }
});

// Handle Admin Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('adminToken', data.token);
            showDashboard();
        } else {
            loginError.textContent = data.message || 'Invalid username or password';
            loginError.classList.remove('hidden');
        }
    } catch (err) {
        loginError.textContent = 'Server offline. Start backend server first.';
        loginError.classList.remove('hidden');
    }
});

// Logout Action
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    dashboardContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// Show Dashboard & Fetch Dynamic Backend Data
function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    fetchDashboardData();
}

async function fetchDashboardData() {
    const token = localStorage.getItem('adminToken');
    try {
        // Fetch Projects Count
        const projRes = await fetch(`${API_URL}/projects`);
        const projects = await projRes.json();
        if (projRes.ok) {
            document.getElementById('stat-projects').textContent = projects.length;
        }

        // Fetch Contact Messages from DB
        const msgRes = await fetch(`${API_URL}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const messages = await msgRes.json();
        
        if (msgRes.ok) {
            document.getElementById('stat-messages').textContent = messages.length;
            const msgList = document.getElementById('messages-list');
            msgList.innerHTML = '';

            if (messages.length === 0) {
                msgList.innerHTML = `<p class="text-xs text-gray-500 text-center py-4">No recent messages</p>`;
                return;
            }

            messages.slice(0, 4).forEach(msg => {
                const initial = msg.name ? msg.name.charAt(0).toUpperCase() : 'U';
                const div = document.createElement('div');
                div.className = 'p-3 bg-gray-900/60 border border-gray-800/80 rounded-xl flex items-center justify-between';
                div.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">${initial}</div>
                        <div>
                            <h4 class="text-xs font-bold text-white">${msg.name}</h4>
                            <p class="text-[10px] text-gray-400">${msg.message.substring(0, 30)}...</p>
                        </div>
                    </div>
                    <span class="text-[10px] text-gray-500">${new Date(msg.createdAt).toLocaleDateString()}</span>
                `;
                msgList.appendChild(div);
            });
        }
    } catch (err) {
        console.error('Error fetching data from API:', err);
    }
}
