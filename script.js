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