const BACKEND_URL = 'http://localhost:5000/api';

// 1. Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        try {
            const res = await fetch(`${BACKEND_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const data = await res.json();

            if (res.ok) {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.classList.remove('hidden', 'text-red-400');
                formStatus.classList.add('text-emerald-400');
                contactForm.reset();
            } else {
                formStatus.textContent = data.message || 'Failed to send message.';
                formStatus.classList.remove('hidden', 'text-emerald-400');
                formStatus.classList.add('text-red-400');
            }
        } catch (err) {
            formStatus.textContent = 'Network error. Server might be offline.';
            formStatus.classList.remove('hidden', 'text-emerald-400');
            formStatus.classList.add('text-red-400');
        }
    });
}

// 2. Fetch Projects Dynamically from Backend
async function fetchPortfolioProjects() {
    try {
        const res = await fetch(`${BACKEND_URL}/projects`);
        const projects = await res.json();
        
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid && projects.length > 0) {
            projectsGrid.innerHTML = ''; // Clear static fallback if database has projects
            projects.forEach(project => {
                const div = document.createElement('div');
                div.className = 'bg-cardBg border border-gray-800 rounded-2xl overflow-hidden p-4 flex flex-col justify-between';
                div.innerHTML = `
                    <div>
                        <div class="bg-gray-900 h-40 rounded-xl mb-4 overflow-hidden relative">
                            <img src="${project.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'}" alt="${project.title}" class="w-full h-full object-cover">
                        </div>
                        <h3 class="font-bold text-lg text-white mb-1">${project.title}</h3>
                        <p class="text-gray-400 text-xs mb-4">${project.description}</p>
                    </div>
                    <a href="${project.liveUrl || '#'}" target="_blank" class="w-full py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-xs font-semibold text-center transition border border-blue-500/30">Live Demo</a>
                `;
                projectsGrid.appendChild(div);
            });
        }
    } catch (err) {
        console.error('Could not fetch projects, using static fallback.', err);
    }
}

// Run on page load
window.addEventListener('DOMContentLoaded', () => {
    fetchPortfolioProjects();
});
