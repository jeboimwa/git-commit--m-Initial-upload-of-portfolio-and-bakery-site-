// CUSTOM CURSOR
const cursor = document.querySelector('.cursor');
let mouse = { x: 0, y: 0 }; // Track mouse globally for particles

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// PARTICLE BACKGROUND WITH MOUSE INTERACTION
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let particles = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
    }
    update() {
        // Normal drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Screen wrapping
        if (this.x > canvas.width) this.x = 0; else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0; else if (this.y < 0) this.y = canvas.height;

        // INTERACTIVITY: Particles flee from the mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) { // If mouse is close
            this.x -= dx / 20; // Push particle away
            this.y -= dy / 20;
        }
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.6)';
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
        ctx.fill();
    }
}
function init() { 
    particles = [];
    for (let i = 0; i < 150; i++) particles.push(new Particle()); 
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
init(); animate();

// TYPING EFFECT
const typeElement = document.querySelector('.typewriter');
if (typeElement) {
    const text = typeElement.innerHTML;
    typeElement.innerHTML = '';
    let i = 0;
    function type() {
        if (i < text.length) { 
            typeElement.innerHTML += text.charAt(i); 
            i++; 
            setTimeout(type, 40); 
        }
    }
    // Delay typing until after loader finishes
    setTimeout(type, 1500);
}

// LOADER LOGIC
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => { 
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }, 1000); // Gives the loader 1 second to show before fading
    }
});

// ADDED: FAKE SYSTEM DIAGNOSTICS (Updates numbers randomly to look cool)
setInterval(() => {
    const cpu = document.getElementById('cpu-load');
    const ram = document.getElementById('ram-load');
    if(cpu && ram) {
        cpu.innerText = Math.floor(Math.random() * (45 - 15 + 1) + 15) + '%';
        ram.innerText = (Math.random() * (2.8 - 1.1) + 1.1).toFixed(2) + 'GB';
    }
}, 2000);// --- METADATA LOGIC ---

// 1. Real-time Clock
function updateClock() {
    const clockElement = document.getElementById('meta-clock');
    if (!clockElement) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    clockElement.innerText = timeString;
}

// 2. Session Uptime Counter
let startTime = Date.now();
function updateUptime() {
    const uptimeElement = document.getElementById('meta-uptime');
    if (!uptimeElement) return;

    let diff = Date.now() - startTime;
    let seconds = Math.floor(diff / 1000) % 60;
    let minutes = Math.floor(diff / (1000 * 60)) % 60;
    let hours = Math.floor(diff / (1000 * 60 * 60));

    uptimeElement.innerText = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Initialize intervals
setInterval(updateClock, 1000);
setInterval(updateUptime, 1000);
updateClock(); // Run immediately so it's not 00:00:00 on load