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