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

const calculatorButtons = document.querySelectorAll('.button-grid .numbers-and-operators');
const equalsButton = document.getElementById('button-zero');
const clearButton = document.getElementById('display-clear');

const entryClick = document.getElementById('calculatorClick');

calculatorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        entryClick.currentTime = 0;
        entryClick.play();

        particles.forEach(p => { // 
              p.vx += (Math.random() - 0.5) * 1.2;
              p.vy += (Math.random() - 0.5) * 1.2;
            });         
    });
});

equalsButton.addEventListener('click', () => {
    displaySolved.currentTime = 0;
    displaySolved.play();

    // particle logic when solved
});

clearButton.addEventListener('click', () => {
    displayClear.currentTime = 0;
    displayClear.play();

    // particle logic when cleared
    
});

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

for (let i = 0; i < Math.floor(((window.innerHeight + window.innerWidth) / 2 ) /10); i++) { // variable particle count based on canvas width, might change it to base around both height and width
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

        if (p1.x < 0) {
            p1.x = 0;
            p1.vx *= -0.8;
        } else if (p1.x > canvas.width) { 
            p1.x = canvas.width;
            p1.vx *= -0.8;
        } // both of the the if conditions to determine the edge of the viewport could lead to a 'sticking'
        // phenomenom due to the position timings when the part is begin redirected with a negative sub 0 value
        // instead i had to opt to update their positoin by brute force first and move them into the area they are allowed to be in


        if (p1.y < 0) {
            p1.y = 0;
            p1.vy *= -0.8;
        } else if (p1.y > canvas.height) {
            p1.y = canvas.height;
            p1.vy *= -0.8;
        }

        particles.forEach(p2 => { // checks particle against other particles to average out the distance and answer if statement for connections
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy); // euclidean distance formula

            if (dist < 100) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 100})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2, 0, Math.PI *2); // creates the dots and fill them with the fillStyle color
        ctx.fill();
    });

    requestAnimationFrame(plexusAnimation);
}

plexusAnimation();


