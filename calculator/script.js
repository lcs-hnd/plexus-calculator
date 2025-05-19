// calc declarations
let operand1 = null;
let operator = null;
let currentValue = '';
let shouldResetDisplay = false;

// plexus declarations
let particles = [];
let particleCountMultiplier = 0.00015; // arbitrary multiplier
let fadeOverlayOpacity = 1; // initial & transitional fadeaway
const fadeSpeed = 0.001; // iterated on plexus logic
const canvas = document.getElementById('plexus');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// plexus particle regen command
function particleRegeneration() {
    let particleCount = Math.floor(((window.innerHeight * window.innerWidth) * particleCountMultiplier));
    particles = []; 

    for (let i = 0; i < particleCount ; i++) { 
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5, // -0.5 to 0.5 halved for random velocity,
            vy: (Math.random() - 0.5) * 0.5,
            opacity: 1
        });
    };
}

// calculator logic
const operators = {
    addition: (a, b) => a + b,
    subtraction: (a, b) => a - b,
    division: (a, b) => a / b,
    multiplication: (a, b) => a * b
};

function operate(a, b, op) {
    return op(a, b);
}

// decimal handling 
document.getElementById('decimal').addEventListener('click', () => {
    if (shouldResetDisplay) {
        display.innerHTML = '';
        currentValue = '';
        shouldResetDisplay = false;
    }

    if (!currentValue.includes('.')) {
        currentValue += '.';
        const span = document.createElement('span');
        span.className = 'display-number';
        span.textContent = '.';
        display.appendChild(span);
    }
});


// operator selector and evaluator
document.querySelectorAll('.operators').forEach(button => {
    button.addEventListener('click', () => {
        const opFunction = operators[button.id];

        if (operand1 !== null && operator && currentValue !== '') {
            const result = operate(parseFloat(operand1), parseFloat(currentValue), operator);

            if (result === Infinity || isNaN(result)) {
                display.textContent = 'Kevin: Yoghurt';
                setTimeout(() => {
                    display.textContent = '';
                }, 1000);
                operand1 = null;
                operator = null;
                currentValue = '';
                return;
            }

            display.textContent = result;
            operand1 = result;
            currentValue = result;
        } else {
            operand1 = currentValue;
        }

        operator = opFunction;
        shouldResetDisplay = true;
    });
});

// pull button meaning and update display
document.querySelectorAll('.just-numbers').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if(shouldResetDisplay) {
            display.innerHTML = '';
            currentValue = '';
            shouldResetDisplay = false;
        }

        currentValue += value;
        const span = document.createElement('span');
        span.className = 'display-number';
        span.textContent = value;
        display.appendChild(span);
    })
});

// background clear and equals button
const equalsButton = document.getElementById('equals');

equalsButton.addEventListener('click', () => { // expression solved SFX
    displaySolved.currentTime = 0;
    displaySolved.play();
});

equalsButton.addEventListener('click', () => { // multiplier increase and particle regen
    if (particleCountMultiplier < 0.0004) {
            particleCountMultiplier += 0.00005;
            fadeOverlayOpacity = 1;
            particleRegeneration();
        }
});

equalsButton.addEventListener('click', () => {
    if (operand1 !== null && operator && currentValue !== '') {
        const result = operate(parseFloat(operand1), parseFloat(currentValue), operator);

        if (result === Infinity || isNaN(result)) {
            display.textContent = 'sybau 🥀🥀';
            setTimeout(() => {
                display.textContent = '';
            }, 2000);
            operand1 = null;
            operator = null;
            currentValue = '';
            return;
        }

        display.textContent = result;
        operand1 = result;
        currentValue = '';
        shouldResetDisplay = true;
    }
})

// background clear and remove remove expression
const clearButton = document.getElementById('display-clear'); // AC button

clearButton.addEventListener('click', () => { // clear SFX
    displayClear.currentTime = 0;
    displayClear.play();
});

clearButton.addEventListener('click', () => { // particle reduction and overlay regen
    if (particleCountMultiplier > 0) {
        particleCountMultiplier -= 0.00005;
        fadeOverlayOpacity = 1;
        particleRegeneration();
    }
});

clearButton.addEventListener('click', () => {
    operand1 = null;
    operator = null;
    currentValue = '';
    display.innerHTML = '';
    shouldResetDisplay = false;
});

// particle movement burst and sound
const keypadSFX = document.getElementById('calculatorClick');
const numbersAndOperators = document.querySelectorAll('.numbers-and-operators');

numbersAndOperators.forEach(btn => {
    btn.addEventListener('click', () => {
        keypadSFX.currentTime = 0;
        keypadSFX.play();

        particles.forEach(p => { 
            if (Math.abs(p.vx) < 0.8) {
                p.vx *= 3;
                p.vy *= 3;
            }
        });  
    });
});

// plexus logic
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

// canvas size updater
window.addEventListener('resize', () => { 
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});

const display = document.getElementById('display');

plexusAnimation();
particleRegeneration();