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

const video = document.getElementById('background-video');
video.playbackRate = 0.7;

// resolve entry sfx