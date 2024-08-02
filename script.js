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