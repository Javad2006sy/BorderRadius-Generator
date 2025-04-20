const visualizer = document.querySelector('#visualizer');
const outputCode = document.querySelector('#code');
const outputButton = document.querySelector('#copy');
const pointers = visualizer.querySelectorAll('.visualizer_pointer');

let isDragging = false;
let activeElement = null;
let code = '10% 10% 10% 10% / 10% 10% 10% 10%';

outputButton.addEventListener('click', (e) => {copyCode(e)});

pointers.forEach((pointer) => {
    pointer.addEventListener('mousedown', () => {
        activeElement = pointer;
        isDragging = true;
    });
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    activeElement = null;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const position = getPosition(e, activeElement);
        code = updateCode(position);

        activeElement.style.setProperty('--pointer-place', `${position}%`);
        visualizer.style.setProperty('--border-code', code);
        outputCode.innerText = code;
    };
});

function getPosition(e, element) {
    const movement = element.getAttribute('data-movement');
    const direction = element.getAttribute('data-border').split('-')[1];
    let pos;

    if (movement == 'horizental') {
        const visualizerLeftDistance = visualizer.getBoundingClientRect().left;
        pos = Math.floor(((e.clientX - visualizerLeftDistance) / visualizer.clientWidth) * 100);

        if ('12'.includes(direction)) {
            pos = 100 - pos;
        };
    };

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

function updateCode(pos) {
    let codeAddress = activeElement.getAttribute('data-border').split('-');
    let codePart = code.split(' / ');
    let targetPart = codePart[Number(codeAddress[0])].split(' ');
    
    targetPart[Number(codeAddress[1])] = `${pos}%`;
    codePart[Number(codeAddress[0])] = targetPart.join(' ');
    
    return codePart.join(' / ');
}

function copyCode(e) {
    e.preventDefault();
    navigator.clipboard.writeText(code);
    outputButton.innerText = 'Copied!';

    setTimeout(() => {
        outputButton.innerText = 'Copy';
    }, 2000);
}