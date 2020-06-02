const UiSelectors = {
    pencilColorSelector: 'pencil-color',
    canvasColorSelector: 'background-color',
    pencilSizeSelector: 'pencil-size',
    clearButtonSelector: '[data-button-clear]',
    saveButtonSelector: '[data-button-save]'
};

const pencilColor = document.getElementById(UiSelectors.pencilColorSelector);
const backgroundColor = document.getElementById(UiSelectors.canvasColorSelector);
const pencilSize = document.getElementById(UiSelectors.pencilSizeSelector);
const clearButton = document.querySelector(UiSelectors.clearButtonSelector);
const saveButton = document.querySelector(UiSelectors.saveButtonSelector);

let paths = [];
let currentPath = [];

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(backgroundColor.value);
}

function draw() {
    if (mouseIsPressed) {
        const point = {
            x: mouseX,
            y: mouseY,
            color: pencilColor.value,
            size: pencilSize.value
        };
        currentPath.push(point);
        strokeWeight(point.size);
        stroke(point.color);
        line(mouseX, mouseY, pmouseX, pmouseY);
    } else {
        refreshImage();
    }
}

function mousePressed() {
    currentPath = [];
}

function mouseReleased() {
    paths.push(currentPath);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(backgroundColor.value);
}

function refreshImage() {
    paths.forEach(path => {
        for(let i = 1; i < path.length; i++) {
            stroke(path[i].color);
            strokeWeight(path[i].size);
            line(path[i].x, path[i].y, path[i-1].x, path[i-1].y);
        }
    });
}

backgroundColor.addEventListener('change', function() {
    background(backgroundColor.value);
});

clearButton.addEventListener('click', () => {
    paths.length = 0;
    clear();
    background(backgroundColor.value);
});

saveButton.addEventListener('click', () => saveCanvas('myImage', 'jpg'));










