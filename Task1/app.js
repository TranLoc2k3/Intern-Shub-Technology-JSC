const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const reader = require('xlsx');

app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Data/File'); // Folder to save the file
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now(); 
        cb(null, `data-${timestamp}.xlsx`);
    }
});
const upload = multer({ storage: storage });

// Uploaded file can storage in cloud such as AWS S3, Google Cloud Storage...but I will storage in local
app.post('/upload', upload.single('file'), function (req, res, next) {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Check end file is .xlsx
    const ext = path.extname(req.file.originalname);
    if (ext !== '.xlsx') {
        return res.status(400).send('File type is not supported.');
    }
    // Get the URL of the uploaded file in folder Data/File
    // In real project, I will use the cloud storage service to get the URL of the uploaded file and save it in a table in the database
    const latestFileName = './Data/File/' + req.file.filename;
    fs.writeFile('./Data/URL_File_Lasted.txt', latestFileName, (err) => {
        if (err) throw err;
    });
    res.status(200).send('File uploaded successfully.');
});


app.post('/query', function (req, res) {
    const {startTime, endTime} = req.body;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

    if (!startTime.match(timeRegex) || !endTime.match(timeRegex)) {
        res.status(400).send('Invalid time format. Please use HH:MM:SS format.');
        return;
    }

    if (startTime > endTime) {
        res.status(400).send('Start time must be less than or equal to end time.');
        return;
    }
    

    const urlFilePath = './Data/URL_File_Lasted.txt';
    if (!fs.existsSync(urlFilePath)) {
        return res.status(404).send('File not found.');
    }

    // Read the file URL_File_Lasted.txt to get the latest file URL
    fs.readFile(urlFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file.');
        }
        const reader = require('xlsx')

        const file = reader.readFile(data)
        let totalMoney = 0;
        for (const sheetName of file.SheetNames) {
            const worksheet = file.Sheets[sheetName];
            const jsonData = reader.utils.sheet_to_json(worksheet);
            // Skip the first 5 rows because they are the header
            // If data was sorted by time, I could use binary search to find the start and end index
            // Comlexity of binary search is O(log(n)) 
            for (let i = 5; i < jsonData.length; i++) {
                if (jsonData[i].__EMPTY_1 >= startTime && jsonData[i].__EMPTY_1 <= endTime) {
                    totalMoney += jsonData[i].__EMPTY_7;
                }
            }
        }
        res.status(200).send({total: totalMoney});
    });
});


app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});