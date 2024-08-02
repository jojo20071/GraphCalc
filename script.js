document.getElementById('loadFile').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const data = event.target.result;
            parsedData = parseData(data);
            drawGraph();
        };
        
        reader.readAsText(file);
    } else {
        alert('Please select a file.');
    }
});

document.getElementById('applySettings').addEventListener('click', function() {
    drawGraph();
});

let parsedData = [];

function parseData(data) {
    const lines = data.trim().split('\n');
    const result = [];
    
    for (const line of lines) {
        const [x, y] = line.split(',').map(Number);
        if (!isNaN(x) && !isNaN(y)) {
            result.push({ x, y });
        }
    }
    
    return result;
}

function drawGraph() {
    const canvas = document.getElementById('graphCanvas');
    const context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const graphType = document.getElementById('graphType').value;
    const lineColor = document.getElementById('lineColor').value;
    const lineWidth = parseInt(document.getElementById('lineWidth').value, 10);
    const xMin = parseFloat(document.getElementById('xMin').value) || 0;
    const xMax = parseFloat(document.getElementById('xMax').value) || 100;
    const yMin = parseFloat(document.getElementById('yMin').value) || 0;
    const yMax = parseFloat(document.getElementById('yMax').value) || 100;
    const showGrid = document.getElementById('showGrid').checked;
    
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    
    const xScale = canvas.width / (xMax - xMin);
    const yScale = canvas.height / (yMax - yMin);
    
    if (showGrid) {
        drawGrid();
    }
    
    if (graphType === 'line') {
        drawLineGraph();
    } else if (graphType === 'bar') {
        drawBarGraph();
    }
    
    function drawLineGraph() {
        context.beginPath();
        for (let i = 0; i < parsedData.length; i++) {
            const point = parsedData[i];
            const x = (point.x - xMin) * xScale;
            const y = canvas.height - (point.y - yMin) * yScale;
            
            if (i === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }
        context.stroke();
    }
    
    function drawBarGraph() {
        const barWidth = canvas.width / parsedData.length;
        for (let i = 0; i < parsedData.length; i++) {
            const point = parsedData[i];
            const x = i * barWidth;
            const y = canvas.height - (point.y - yMin) * yScale;
            const barHeight = (point.y - yMin) * yScale;
            
            context.fillStyle = lineColor;
            context.fillRect(x, y, barWidth - 1, barHeight);
        }
    }
    
    function drawGrid() {
        context.strokeStyle = '#ddd';
        context.lineWidth = 1;
        
        // Vertical lines
        for (let i = xMin; i <= xMax; i += (xMax - xMin) / 10) {
            const x = (i - xMin) * xScale;
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
        }
        
        // Horizontal lines
        for (let i = yMin; i <= yMax; i += (yMax - yMin) / 10) {
            const y = canvas.height - (i - yMin) * yScale;
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
        }
    }
}

const canvas = document.getElementById('graphCanvas');
const context = canvas.getContext('2d');
let xMin = 0, xMax = 10, yMin = 0, yMax = 10;
let xScale, yScale;
let showGrid = true;

document.getElementById('applySettings').addEventListener('click', updateGraphSettings);

function updateGraphSettings() {
    const graphType = document.getElementById('graphType').value;
    const lineColor = document.getElementById('lineColor').value;
    const lineWidth = parseInt(document.getElementById('lineWidth').value);
    xMin = parseFloat(document.getElementById('xMin').value) || xMin;
    xMax = parseFloat(document.getElementById('xMax').value) || xMax;
    yMin = parseFloat(document.getElementById('yMin').value) || yMin;
    yMax = parseFloat(document.getElementById('yMax').value) || yMax;
    showGrid = document.getElementById('showGrid').checked;

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (showGrid) drawGrid();
    if (graphType === 'line') {
        drawLineGraph(lineColor, lineWidth);
    } else if (graphType === 'bar') {
        drawBarGraph(lineColor, lineWidth);
    }
}

function drawLineGraph(lineColor, lineWidth) {
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    context.beginPath();
    // Example data points
    const data = [{x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 5}, {x: 4, y: 7}];
    data.forEach((point, index) => {
        const x = (point.x - xMin) * xScale;
        const y = canvas.height - (point.y - yMin) * yScale;
        if (index === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    });
    context.stroke();
}

function drawBarGraph(barColor, barWidth) {
    context.fillStyle = barColor;
    // Example data points
    const data = [{x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 5}, {x: 4, y: 7}];
    data.forEach(point => {
        const x = (point.x - xMin) * xScale;
        const y = canvas.height - (point.y - yMin) * yScale;
        const barHeight = canvas.height - y;
        context.fillRect(x, y, barWidth - 1, barHeight);
    });
}

function drawGrid() {
    context.strokeStyle = '#ddd';
    context.lineWidth = 1;
    
    // Vertical lines
    for (let i = xMin; i <= xMax; i += (xMax - xMin) / 10) {
        const x = (i - xMin) * xScale;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }
    
    // Horizontal lines
    for (let i = yMin; i <= yMax; i += (yMax - yMin) / 10) {
        const y = canvas.height - (i - yMin) * yScale;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }
}

// Initial graph setup
xScale = canvas.width / (xMax - xMin);
yScale = canvas.height / (yMax - yMin);
if (showGrid) drawGrid();
drawLineGraph('#000', 2);