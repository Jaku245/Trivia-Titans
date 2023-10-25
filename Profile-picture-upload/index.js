const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

//Routes
app.get("/", (req, res) => {
    console.log("Hello World!");
    res.status(200).send("Hello World!");
});

// Configure AWS SDK
AWS.config.update({
    accessKeyId: 'ASIARDLXMU6OFALATZIY',
    secretAccessKey: 'ekBA0nX/rgiqVvzuAUgRB2sctS0VtGClk4RgzpdQ',
    sessionToken: 'FwoGZXIvYXdzEHUaDCL24Kx3TX4tQAcbuCK9AV0jFf2bKZJd67OBHErogp+4uYMY5zhlzdduYv2Q/Hr8mwNxkmhcVzmOIHM+ykAlSshswmQ4WY+BRS7ycHzkexpR32W00HaUCdSbrzlrH3Ovwly574FT0sbLY/7fy11gzvSe/xHflGMn3KXvds2Gh2J9gwQZ0k/EteypmqDNzVLdMkqwsIakJX/UADWGyI2kc92ysGDjP3IrUZU4b+BZexIkr34BouT1qLlFGhEsJCysSUjlTxnrzbH/HBQpYCi8xKymBjItLTCiZN+MZjNwBQuY1HLAsBn1tH9RVoXiJZjY0fnB0FOoCZzBf/VSSu1pkt0K',
    region: 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = 'trivia-titans';

// Set up multer storage and upload middleware
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle image upload
app.post('/uploadImage', upload.single('image'), (req, res) => {
    const file = req.file;
    const key = file.originalname;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error uploading image:', err);
            res.status(500).json({ error: 'Failed to upload image' });
        } else {
            console.log('Image uploaded successfully:', data.Location);
            res.json({ imageUrl: data.Location });
        }
    });
});

app.listen(8001, () => {
    console.log('Running on http://localhost:8001');
});

exports.app = app;