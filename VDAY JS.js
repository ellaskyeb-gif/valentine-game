// Game state
let currentScreen = 'game'; 


const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
const questionCanvas = document.getElementById('questionCanvas');
const questionCtx = questionCanvas.getContext('2d');
const sadCanvas = document.getElementById('sadCanvas');
const sadCtx = sadCanvas.getContext('2d');


gameCanvas.width = 800;
gameCanvas.height = 600;
questionCanvas.width = 200;
questionCanvas.height = 200;
sadCanvas.width = 200;
sadCanvas.height = 200;


const player = {
    x: 400,
    y: 300,
    width: 32,
    height: 32,
    speed: 3,
    color: '#D4A574' // eevee!
};

const pokeballs = [];
const obstacles = [];
let pokeballsCollected = 0;
const keys = {};
const particles = [];


function init() {
    // create pokeballs
    for (let i = 0; i < 15; i++) {
        pokeballs.push({
            x: Math.random() * (gameCanvas.width - 40) + 20,
            y: Math.random() * (gameCanvas.height - 40) + 20,
            size: 24,
            collected: false,
            rotation: Math.random() * Math.PI * 2,
            spinSpeed: 0.02
        });
    }

  
    for (let i = 0; i < 8; i++) {
        obstacles.push({
            x: Math.random() * (gameCanvas.width - 60) + 30,
            y: Math.random() * (gameCanvas.height - 60) + 30,
            width: 40,
            height: 40
        });
    }
}

// draw pixel  eevee
function drawEevee(ctx, x, y, isMad = false) {
    const size = 8;
    const px = x;
    const py = y;
    

  
    ctx.fillStyle = '#D4A574'; 
    ctx.fillRect(px + size * 2, py + size * 2.5, size * 4, size * 3.5);
    
    // Head 
    ctx.fillStyle = '#D4A574';
    ctx.fillRect(px + size * 2.5, py + size * 1, size * 3, size * 2);
    
    // Ears (big and pointy)
    ctx.fillStyle = '#D4A574';
    // Left ear
    ctx.fillRect(px + size * 1.5, py, size * 0.8, size * 1.5);
    ctx.fillRect(px + size * 1, py + size * 0.5, size * 0.8, size * 1);
    // Right ear
    ctx.fillRect(px + size * 5.5, py, size * 0.8, size * 1.5);
    ctx.fillRect(px + size * 6, py + size * 0.5, size * 0.8, size * 1);
    
    // Dark brown ear tips
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(px + size * 1, py, size * 0.5, size * 0.8);
    ctx.fillRect(px + size * 6.5, py, size * 0.5, size * 0.8);
    
    // Fluffy collar 
    ctx.fillStyle = '#F5E6D3';
    ctx.fillRect(px + size * 1.5, py + size * 3.5, size * 5, size * 1.5);
    ctx.fillRect(px + size * 2, py + size * 4, size * 4, size);
    
    // Tail (fluffy)
    ctx.fillStyle = '#D4A574';
    ctx.fillRect(px + size * 6.5, py + size * 4, size * 1.5, size * 2);
    ctx.fillRect(px + size * 7, py + size * 4.5, size, size * 1.5);
    // Dark brown tail tip
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(px + size * 7, py + size * 5.5, size, size * 0.8);
    
    if (isMad) {
        // Angry eyes (slanted)
        ctx.fillStyle = '#000';
        ctx.fillRect(px + size * 2.5, py + size * 2.5, size * 0.6, size * 0.6);
        ctx.fillRect(px + size * 4.8, py + size * 2.5, size * 0.6, size * 0.6);
        // Angry mouth (frown)
        ctx.fillStyle = '#000';
        ctx.fillRect(px + size * 2.5, py + size * 4.5, size * 3, size * 0.4);
        // Angry eyebrows
        ctx.fillStyle = '#000';
        ctx.fillRect(px + size * 2, py + size * 2, size * 1.2, size * 0.25);
        ctx.fillRect(px + size * 4.8, py + size * 2, size * 1.2, size * 0.25);
    } else {
        // Eyes (happy - big and cute)
        ctx.fillStyle = '#000';
        ctx.fillRect(px + size * 2.8, py + size * 2.2, size * 0.8, size * 0.8);
        ctx.fillRect(px + size * 4.5, py + size * 2.2, size * 0.8, size * 0.8);
        
        // Nose (small triangle)
        ctx.fillStyle = '#000';
        ctx.fillRect(px + size * 3.5, py + size * 3.2, size * 0.5, size * 0.3);
        
        // Mouth (happy smile)
        ctx.fillStyle = '#000';
        ctx.fillRect(px + size * 3, py + size * 3.8, size * 0.5, size * 0.3);
        ctx.fillRect(px + size * 4.5, py + size * 3.8, size * 0.5, size * 0.3);
        ctx.fillRect(px + size * 3.5, py + size * 4, size * 1, size * 0.3);
    }
    
    
    ctx.fillStyle = '#E8C9A0';
    ctx.fillRect(px + size * 3, py + size * 4.5, size * 2, size * 1);
}

// Draw Pokeball
function drawPokeball(ctx, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    const radius = size / 2;
    
    // Top half (red)
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(0, 0, radius, Math.PI, 0, false);
    ctx.fill();
    
    // Bottom half (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI, false);
    ctx.fill();
    
    // Center line (black)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-radius, -2, radius * 2, 4);
    
    // Center button (white circle with black border)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Inner button (small black circle)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

//  obstacle (tree)
function drawTree(ctx, x, y) {
    // Trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 15, y + 25, 10, 15);
    
    // Leaves
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x + 10, y + 20, 8, 0, Math.PI * 2);
    ctx.arc(x + 30, y + 20, 8, 0, Math.PI * 2);
    ctx.moveTo(x + 20, y + 35);
    ctx.lineTo(x + 5, y + 20);
    ctx.lineTo(x + 35, y + 20);
    ctx.closePath();
    ctx.fill();
}

// Draw background
function drawBackground(ctx, canvas) {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFE5F1');
    gradient.addColorStop(1, '#FFF5F7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Ground
    ctx.fillStyle = '#F0E6E6';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
}

// Check collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update player position
function updatePlayer() {
    let newX = player.x;
    let newY = player.y;
    
    if (keys['w'] || keys['W']) newY -= player.speed;
    if (keys['s'] || keys['S']) newY += player.speed;
    if (keys['a'] || keys['A']) newX -= player.speed;
    if (keys['d'] || keys['D']) newX += player.speed;
    
    // Boundary check
    newX = Math.max(0, Math.min(gameCanvas.width - player.width, newX));
    newY = Math.max(0, Math.min(gameCanvas.height - player.height, newY));
    
    // Check obstacle collision
    const newPlayerRect = { x: newX, y: newY, width: player.width, height: player.height };
    let canMove = true;
    
    for (const obstacle of obstacles) {
        if (checkCollision(newPlayerRect, obstacle)) {
            canMove = false;
            break;
        }
    }
    
    if (canMove) {
        player.x = newX;
        player.y = newY;
    }
    
    // Check pokeball collection
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    for (const pokeball of pokeballs) {
        if (!pokeball.collected) {
            const pokeballRect = {
                x: pokeball.x - pokeball.size / 2,
                y: pokeball.y - pokeball.size / 2,
                width: pokeball.size,
                height: pokeball.size
            };
            
            if (checkCollision(playerRect, pokeballRect)) {
                pokeball.collected = true;
                pokeballsCollected++;
                createParticles(pokeball.x, pokeball.y);
                updateMessage();
                updateProgressBar();
                
                // Check if all collected
                if (pokeballsCollected === pokeballs.length) {
                    setTimeout(() => {
                        showQuestionScreen();
                    }, 1000);
                }
            }
        }
    }
}

// Create particle effects
function createParticles(x, y) {
    const colors = ['#FF6B9D', '#FF8FAB', '#FFD700', '#FFFFFF', '#C44569'];
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1.0,
            decay: 0.02,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

// Update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.life -= p.decay;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Draw particles
function drawParticles(ctx) {
    for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Update progress bar
function updateProgressBar() {
    const progress = (pokeballsCollected / pokeballs.length) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// Update message
function updateMessage() {
    const messages = [
        "almost there...",
        "phoebe go faster. da fawk",
        "Keep going",
        "evee is hungryyy!",
        "MERP MERP MERP!",
        "merp....merpp....",
        "i love uuuuuuu",
        " like a lot hai",
        " beep boop bee bop!",
        "doing good so far",
        "HEH",
        "YOURE SO CLOSE",
        "a little bit more...",
        "One freaking more!",
        "You got them all. YAY PHOEBE111"
    ];
    
    const messageEl = document.getElementById('message');
    if (pokeballsCollected <= messages.length) {
        messageEl.textContent = messages[pokeballsCollected - 1] || "";
    }
}

// Screen management
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenName + 'Screen').classList.add('active');
    currentScreen = screenName;
}

function showQuestionScreen() {
    showScreen('question');
    drawQuestionEevee();
}

function showGalleryScreen() {
    showScreen('gallery');
    loadPhotos();
}

function showSadScreen() {
    showScreen('sad');
    drawSadEevee();
}

// Draw Eevee on question screen
function drawQuestionEevee() {
    questionCtx.clearRect(0, 0, questionCanvas.width, questionCanvas.height);
    drawBackground(questionCtx, questionCanvas);
    drawEevee(questionCtx, 80, 80, false);
}

// Draw sad Eevee
function drawSadEevee() {
    sadCtx.clearRect(0, 0, sadCanvas.width, sadCanvas.height);
    drawBackground(sadCtx, sadCanvas);
    drawEevee(sadCtx, 80, 80, true);
}

// Load photos in gallery
function loadPhotos() {
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '<div class="photo-placeholder"><p>Loading photos...</p></div>';
    
    // Try to load photos from photos folder (supports jpg, jpeg, png, gif)
    const extensions = ['jpg', 'jpeg', 'png', 'gif'];
    const loadedPhotos = [];
    let checkedPhotos = 0;
    const maxPhotos = 20;
    
    function tryLoadPhoto(num, extIndex) {
        if (extIndex >= extensions.length) {
            checkedPhotos++;
            if (checkedPhotos === maxPhotos) {
                updateGallery();
            }
            return;
        }
        
        const img = document.createElement('img');
        img.src = `photos/photo${num}.${extensions[extIndex]}`;
        img.alt = `Photo ${num}`;
        
        img.onload = function() {
            loadedPhotos.push(img);
            updateGallery();
        };
        
        img.onerror = function() {
            // Try next extension
            tryLoadPhoto(num, extIndex + 1);
        };
    }
    
    function updateGallery() {
        gallery.innerHTML = '';
        if (loadedPhotos.length === 0 && checkedPhotos === maxPhotos) {
            gallery.innerHTML = `
                <div class="photo-placeholder">
                    <p>💝 Add your photos here! 💝</p>
                    <p class="photo-instructions">Place your images in a folder named "photos" and name them: photo1.jpg, photo2.jpg, photo3.png, etc.</p>
                    <p class="photo-instructions">Supported formats: .jpg, .jpeg, .png, .gif</p>
                </div>
            `;
        } else if (loadedPhotos.length > 0) {
            loadedPhotos.forEach(img => gallery.appendChild(img));
        }
    }
    
    // Try to load up to 20 photos
    for (let i = 1; i <= maxPhotos; i++) {
        tryLoadPhoto(i, 0);
    }
    
    // Update gallery after a delay in case photos are still loading
    setTimeout(updateGallery, 1000);
}

// Game loop
function gameLoop() {
    if (currentScreen !== 'game') {
        requestAnimationFrame(gameLoop);
        return;
    }
    
    // Clear canvas
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Draw background
    drawBackground(gameCtx, gameCanvas);
    
    // Draw obstacles
    for (const obstacle of obstacles) {
        drawTree(gameCtx, obstacle.x, obstacle.y);
    }
    
    // Update and draw pokeballs
    for (const pokeball of pokeballs) {
        if (!pokeball.collected) {
            pokeball.rotation += pokeball.spinSpeed;
            drawPokeball(gameCtx, pokeball.x, pokeball.y, pokeball.size, pokeball.rotation);
        }
    }
    
    // Update and draw particles
    updateParticles();
    drawParticles(gameCtx);
    
    // Update player
    updatePlayer();
    
    // Draw player
    drawEevee(gameCtx, player.x, player.y, false);
    
    // Update pokeballs count
    document.getElementById('pokeballsCount').textContent = pokeballsCollected;
    
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Button event listeners
document.getElementById('yesButton').addEventListener('click', () => {
    showGalleryScreen();
});

document.getElementById('noButton').addEventListener('click', () => {
    showSadScreen();
});

document.getElementById('backButton').addEventListener('click', () => {
    showScreen('game');
    // Reset game
    pokeballsCollected = 0;
    player.x = 400;
    player.y = 300;
    pokeballs.forEach(p => p.collected = false);
    document.getElementById('message').textContent = '';
    document.getElementById('pokeballsCount').textContent = '0';
});

document.getElementById('tryAgainButton').addEventListener('click', () => {
    showQuestionScreen();
});

// Start game
init();
updateProgressBar(); // Initialize progress bar
gameLoop();