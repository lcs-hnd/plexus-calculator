const addition = (a, b) => a + b;

const subtraction = (a, b) => a - b;

const division = (a, b) => a / b;

const multiplication = (a, b) => a * b;

// operators written with arrows functions using implicit returns

function operate(operand1, operand2, operator){
    return operator(operand1, operand2);
};

function valueHolders(){
    let operand1 = null;
    let operand2 = null;
    let operator = null;
    if (null) {
        return operate(operand1, operand2, operator);
    }
    else {
        return "WIP"
    }
}

// numpad and operator entry sfx

const calculatorButtons = document.querySelectorAll('.button-grid button');
const entryClick = document.getElementById('calculatorClick');

calculatorButtons.forEach(btn => {
    btn.addEventListener('onclick', () => {
        entryClick.currentTime = 0;
        entryClick.play();
    });
});

// background-video

// const video = document.getElementById('background-video');
// video.playbackRate = 0.7;

// plexus animation, leaving more comments than usual since it's my first time making one

const canvas = document.getElementById('plexus'); // grabbing the html element
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d'); // grabs the 2d rendering context

window.addEventListener('resize', () => { // uses window global object to resize the canvas
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});

let particles = []; // array for the particles

for (let i = 0; i < Math.floor(window.innerWidth/10); i++) { // variable particle count based on canvas width, might change it to base around both height and width
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5, // -0.5 to 0.5 halved for random velocity
        vy: (Math.random() - 0.5) * 0.5
    });
};

function plexusAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears canvas to prevent trailing
    particles.forEach(p1 => {
        p1.x += p1.vx; // moving particles according to their velocities
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1; // checks particle position to make sure it's not off the viewport
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1; // the velocity multiplier can be reduced from -1 to simulate kinetic energy loss

        particles.forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

        });

    });
}
