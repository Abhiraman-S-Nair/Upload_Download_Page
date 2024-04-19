const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process'); // Import exec function from child_process module
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

// Serve static files from the 'frontend' folder
app.use(express.static('frontend'));
app.use('/results', express.static('backend/results'));

// Route for file upload
app.post('/upload', upload.single('fileInput'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Get the path of the uploaded file
    const uploadedFilePath = path.join(__dirname, '../',req.file.path);

    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, 'processing', 'process_data.py');
    const outputFilePath = path.join(__dirname, 'results', 'output.csv');

    // Execute the Python script with the uploaded file as input
    exec(`python ${pythonScriptPath} ${uploadedFilePath} ${outputFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Python script:', error);
            console.error('Python Script Error Output:', stderr); // Log Python script error output
            return res.status(500).json({ error: 'An error occurred while processing the file.' });
        }
        console.log('Python Script Output:', stdout); // Log Python script output
        console.log('File processed successfully.');

        // Send success response
        res.json({ message: 'File uploaded and processed successfully.', resultFile: '/results/output.csv' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
