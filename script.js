const visualizer = document.querySelector('#visualizer');
const outputCode = document.querySelector('#code');
const outputButton = document.querySelector('#copy');
const pointers = visualizer.querySelectorAll('.visualizer_pointer');

let isDragging = false;
let activeElement = null;
let code = '10% 10% 10% 10% / 10% 10% 10% 10%';

// Invoking `copyCode` function when the copy button is clicked
outputButton.addEventListener('click', (e) => {copyCode(e)});

// Adding mouse events to each pointer
pointers.forEach((pointer) => {
    pointer.addEventListener('mousedown', () => {
        activeElement = pointer;
        isDragging = true;
    });
});

// Reseting variables when mouse button is released
document.addEventListener('mouseup', () => {
    isDragging = false;
    activeElement = null;
});

// Calculating pointer's position and output code when a pointer is being dragged
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // Calculating pointer's position
        const position = getPosition(e, activeElement);
        
        // Calculating output code based on pointer's position
        code = updateCode(position, activeElement);

        // Updating pointer and code
        activeElement.style.setProperty('--pointer-place', `${position}%`);
        visualizer.style.setProperty('--border-code', code);
        outputCode.innerText = code;
    };
});


// Function to calculate pointer's position
function getPosition(e, element) {
    const movement = element.getAttribute('data-movement');
    const direction = element.getAttribute('data-border').split('-')[1];
    let pos;

    // Horizontal pointer
    if (movement == 'horizental') {
        const visualizerLeftDistance = visualizer.getBoundingClientRect().left;
        pos = Math.floor(((e.clientX - visualizerLeftDistance) / visualizer.clientWidth) * 100);

        if ('12'.includes(direction)) {
            pos = 100 - pos;
        };
    };

    // Vertical pointer
    if (movement == 'vertical') {
        const visualizerTopDistance = visualizer.getBoundingClientRect().top;
        pos = Math.floor(((e.clientY - visualizerTopDistance) / visualizer.clientHeight) * 100);

        if ('23'.includes(direction)) {
            pos = 100 - pos;
        };
    };

    pos = pos < 0 ? 0 : pos;
    pos = pos > 100 ? 100 : pos;

    return pos;
}


// Function to update output code based on a pointer position
function updateCode(pos, pointer) {
    let codeAddress = pointer.getAttribute('data-border').split('-');
    let codePart = code.split(' / ');
    let targetPart = codePart[parseInt(codeAddress[0])].split(' ');
    
    targetPart[parseInt(codeAddress[1])] = `${pos}%`;
    codePart[parseInt(codeAddress[0])] = targetPart.join(' ');
    
    return codePart.join(' / ');
}


// Function to copy the output code on user's clipboard
function copyCode(e) {
    e.preventDefault();
    navigator.clipboard.writeText(code);
    outputButton.innerText = 'Copied!';

    setTimeout(() => {
        outputButton.innerText = 'Copy';
    }, 2000);
}