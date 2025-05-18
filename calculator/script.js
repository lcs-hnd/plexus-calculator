const addition = (a, b) => a + b;

const subtraction = (a, b) => a - b;

const division = (a, b) => a / b;

const multiplication = (a, b) => a * b;

// operators written with arrows functions using implicit returns

let operand1 = null;
let operand2 = null;
let operator = null;

function operate(operand1, operand2, operator){
    return operator(operand1, operand2);
};


document.getElementById('division').addEventListener('click', () => {
    if (/\d/.test(display.textContent)) {
        operand1 = currentValue;
        operator = division;
        display.innerHTML = '';
        currentValue = '';
    }
});

document.getElementById('multiplication').addEventListener('click', () => {
    if (/\d/.test(display.textContent)) {
        operand1 = currentValue;
        operator = multiplication;
        display.innerHTML = '';
        currentValue = '';
    }
});

document.getElementById('addition').addEventListener('click', () => {
    if (/\d/.test(display.textContent)) {
        operand1 = currentValue;
        operator = addition;
        display.innerHTML = '';
        currentValue = '';
    }
});

let result = null;

document.getElementById('subtraction').addEventListener('click', () => {
    // if (/\d/.test(operand1) && /\d/.test(display.textContent)) {
    //     operand2 = currentValue;
    //     display.innerHTML = operate(parseFloat(operand1), parseFloat(operand2), operator);
    //     operand1 = display.innerHTML;
    //     operand2 = null;
    // } else if (/\d/.test(operand1) && !/\d/.test(display.textContent)) {
        
    //     operator = subtraction;
    // } else if (/\d/.test(display.textContent)) {
    //     operand1 = currentValue;
    //     operator = subtraction;
    //     display.innerHTML = '';
    //     currentValue = '';
    // }
    if (/\d/.test(operand1) && /\d/.test(display.textContent)) {
        operand2 = currentValue;
        display.innerHTML = operate(parseFloat(operand1), parseFloat(operand2), operator);
        operand1 = display.innerHTML;
        operand2 = null;
});



// function valueHolders() {
//     if (/\d/.test(display.textContent)) {
//         document.getElementById('division').addEventListener('click', () => {
//             operand1 = currentValue;
//             operator = division;
//             display.innerHTML = '';
//             currentValue = '';
//         });
//     }
// }



// numpad and operator entry sfx

const calculatorButtons = document.querySelectorAll('.button-grid .numbers-and-operators');
const equalsButton = document.getElementById('button-zero');
const clearButton = document.getElementById('display-clear');
const calcNoClearButtons = document.querySelectorAll('.button-grid .just-numbers');

const entryClick = document.getElementById('calculatorClick');

calculatorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        entryClick.currentTime = 0;
        entryClick.play();

        particles.forEach(p => { //
            if (Math.abs(p.vx) < 0.8){
                p.vx *= 3;
                p.vy *= 3;
            }
        });         
    });
});

// display update event listener 

equalsButton.addEventListener('click', () => {
    displaySolved.currentTime = 0;
    displaySolved.play();

    // particle logic when solved
});

clearButton.addEventListener('click', () => {
    displayClear.currentTime = 0;
    displayClear.play();

    currentValue = '';
    display.innerHTML = '';

    
});

// const video = document.getElementById('background-video');
// video.playbackRate = 0.7;

// plexus animation, leaving more comments than usual

const canvas = document.getElementById('plexus'); // grabbing the html element
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d'); // grabs the 2d rendering context

window.addEventListener('resize', () => { // uses window global object to resize the canvas
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});

let particleCountMultiplier = 0.00015;

function particleRegeneration() {
    let particleCount = Math.floor(((window.innerHeight * window.innerWidth) * particleCountMultiplier));
    particles = []; // array for the particles

    for (let i = 0; i < particleCount ; i++) { // variable particle count based on canvas width
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5, // -0.5 to 0.5 halved for random velocity,
            vy: (Math.random() - 0.5) * 0.5,

            // bottom three not used atm
            opacity: 1,
            targetOpacity: 1, 
            fadeSpeed: 0.001
        });
    };
}

document.getElementById('display-clear').addEventListener('click', () => {
    if (particleCountMultiplier > 0) {
        particleCountMultiplier -= 0.00005;
        fadeOverlayOpacity = 1;
        particleRegeneration();
    }
});

document.getElementById('button-zero').addEventListener('click', () => {
    if (particleCountMultiplier < 0.0004) {
        particleCountMultiplier += 0.00005;
        fadeOverlayOpacity = 1;
        particleRegeneration();
    }
});

particleRegeneration();

let fadeOverlayOpacity = 1;
const fadeSpeed = 0.001;

function plexusAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears canvas to prevent trailing


    particles.forEach(p1 => {        
        p1.x += p1.vx; // moving particles according to their velocities
        p1.y += p1.vy;

        if (p1.x < 0) {
            p1.x = 0;
            p1.vx *= -1;
        } else if (p1.x > canvas.width) { 
            p1.x = canvas.width;
            p1.vx *= -1;
        } // both of the the if conditions to determine the edge of the viewport could lead to a 'sticking'
        // phenomenom due to the position timings when the part is begin redirected with a negative sub 0 value
        // instead i had to opt to update their positoin by brute force first and move them into the area they are allowed to be in


        if (p1.y < 0) {
            p1.y = 0;
            p1.vy *= -1;
        } else if (p1.y > canvas.height) {
            p1.y = canvas.height;
            p1.vy *= -1;
        }
        
        particles.forEach(p2 => { // checks particle against other particles to average out the distance and answer if statement for connections
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy); // euclidean distance formula

            let maxDistance = 150;

            if (dist < maxDistance) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / maxDistance})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });

        ctx.fillStyle = `rgba(255, 255, 255, ${p1.opacity})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 4, 0, Math.PI *2); // creates the dots and fill them with the fillStyle color
        ctx.fill();

        if (Math.abs(p1.vx) > 0.1) {
            p1.vx *= 0.99;
        }
        if (Math.abs(p1.vy) > 0.1) {
            p1.vy *= 0.99; 
        }

    });

    if (fadeOverlayOpacity > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${fadeOverlayOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            fadeOverlayOpacity -= fadeSpeed;
        }

    requestAnimationFrame(plexusAnimation);
}

plexusAnimation();

const display = document.getElementById('display');
let currentValue = '';

// function updateDisplay(value) {
//     currentValue = value;
    
//     [...currentValue.toString()].forEach((digit, index) => {
//         const span = document.createElement('span');
//         span.className = 'display-number';
//         span.textContent = digit;
//         span.style.animationDelay = `${index * 0.05}s`;
//         display.appendChild(span);
//     });
// }

function updateDisplay(value) {
    currentValue += value;

    const span = document.createElement('span');
    span.className = 'display-number';
    span.textContent = value;
    span.style.animationDelay = `0s`; 
    display.appendChild(span);
}

document.querySelectorAll('.just-numbers').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.textContent;
        updateDisplay(value);
    });
});

document.getElementById('decimal').addEventListener('click', () => {
    if(display.textContent.includes('.')) return;
    updateDisplay('.');
});


// const thanosSnap = document.getElementById('display-clear');

// i was going to implement a singularity on the AC point and add in an orbit for the particles but i realized
// that i need to finish this project first lol
// i'll pick this up right after in a separate repo where i can expose the variables into a proper simulator

// // AC Code

// let center = { x: canvas.width / 2, y: canvas.height / 2 };
// let angle = Math.atan2(p.y - center.y, p.x - center.x);
// let speed = 0.5;

// p.vx += Math.cos(angle) * speed * Math.random();
// p.vx += Math.sin(angle) * speed * Math.random();


// // Death by singularity

// const singularity = document.getElementById('display-clear');
// const singularityRect = singularity.getBoundingClientRect();
// const singularityCenter = {
//     x: singularityRect.left + singularityRect.width / 2, 
//     y: singularityRect.top + singularityRect.height /2
// };




