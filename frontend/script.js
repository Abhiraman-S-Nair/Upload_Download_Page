document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const messageDiv = document.getElementById('message');
    const downloadLink = document.getElementById('downloadLink');
    uploadForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('fileInput', fileInput.files[0]);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                showMessage(data.message);
                if (data.resultFile) {

                    // Update download link href attribute to the resultFile path
                    //downloadLink.href = data.resultFile;
                    // Set the download attribute to retain the file name and extension
                    //downloadLink.setAttribute('download', 'output.csv');

                    // Update download link href attribute to the resultFile path
                    downloadLink.innerHTML = `<a href="${data.resultFile}" download>Download Processed File</a>`;
                    // Display the download link
                    downloadLink.style.display = 'block';
                }
            } else {
                showMessage('Error: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.');
        }
    });

    function showMessage(message) {
        messageDiv.textContent = message;
    }
});
