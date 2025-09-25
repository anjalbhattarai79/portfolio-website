// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Dark/Light Mode Toggle - Start with dark mode
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark

// Apply saved theme on load
document.documentElement.setAttribute('data-theme', currentTheme);
updateToggleButton(currentTheme);

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleButton(theme);
});

// Update the toggle button emoji
function updateToggleButton(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Simple form submission handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'var(--nav-bg)';
    } else {
        navbar.style.backgroundColor = 'transparent';
    }
});

// Copy to clipboard for elements with .click-to-copy
document.querySelectorAll('.click-to-copy').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', async () => {
        const value = el.getAttribute('data-value');
        if (!value) return;
        try {
            await navigator.clipboard.writeText(value);
            showToast('Copied: ' + value);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = value;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToast('Copied: ' + value);
            } catch (e) {
                showToast('Could not copy to clipboard');
            }
            textarea.remove();
        }
    });
});

// Toast helper
const toastEl = document.getElementById('toast');
let toastTimer = null;
function showToast(msg, ms = 2500) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
    }, ms);
}

// Reveal on scroll for elements with .reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('section, .portfolio-item, .skill-category, .education-item').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// Add keyboard accessibility: allow Enter key to trigger copy
document.querySelectorAll('.click-to-copy').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
        }
    });
});

// Portfolio project card click handling
document.querySelectorAll('.portfolio-item').forEach(card => {
    // open deployed if present, otherwise open github link
    card.addEventListener('click', (e) => {
        // If an inner link was clicked, don't handle here
        const innerLink = e.target.closest('.link-icon');
        if (innerLink) return;

        const deployed = card.getAttribute('data-deployed');
        const github = card.getAttribute('data-github');
        const url = deployed || github;
        if (url) window.open(url, '_blank');
    });

    // Make specific link buttons clickable
    card.querySelectorAll('.project-links .link-icon').forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const text = btn.textContent || '';
            const isDeployed = /live demo|demo|live/i.test(text);
            const deployed = card.getAttribute('data-deployed');
            const github = card.getAttribute('data-github');
            if (isDeployed && deployed) {
                window.open(deployed, '_blank');
            } else if (/github/i.test(text) && github) {
                window.open(github, '_blank');
            } else if (btn.dataset.href) {
                window.open(btn.dataset.href, '_blank');
            } else {
                // fallback: open github if available
                if (github) window.open(github, '_blank');
            }
        });
    });

    // If deployed exists, mark the link-button visually
    const deployedExists = !!card.getAttribute('data-deployed');
    if (deployedExists) {
        const links = card.querySelectorAll('.project-links .link-icon');
        links.forEach(l => {
            if (/live|demo|deployed/i.test(l.textContent)) {
                l.classList.add('deployed');
            }
        });
    }
});