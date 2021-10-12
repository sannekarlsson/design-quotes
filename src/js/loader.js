const loader = document.querySelector('.loader');

// Create a div with class dot for the loading animation
function createDot() {
    let dotElement = document.createElement('div');
    dotElement.className = 'dot';
    return dotElement;
}

// Create given quantity of dots and add them to the DOM
export function createDots(quantity) {
    for (let i = 0; i < quantity; i++) {
        loader.appendChild(createDot());
    }
}

// Toggle animation for the loading dots on show & hide
export function toggleBubbling(show) {
    let value = show ? 'running' : 'paused';
    let allDots = document.querySelectorAll('.dot');
    [...allDots].forEach(dot => {
        dot.style.WebkitAnimationPlayState = value;
        dot.style.animationPlayState = value;
    });
}
