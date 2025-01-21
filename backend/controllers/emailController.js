const path = require('path');
const fs = require('fs');
const EmailTemplate = require('../models/emailTemplate');

exports.getEmailLayout = (req, res) => {
    const layoutPath = path.join(__dirname, '../views/layout.html');
    fs.readFile(layoutPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading layout file', error: err.message });
        }
        res.status(200).send(data); // Send the HTML content as a response
    });
};
 exports.uploadImage = (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded or invalid file type' });
        }
    
        const filePath = `http://localhost:3000/uploads/${req.file.filename}`;
        res.status(200).json({
            message: 'Image uploaded successfully',
            filePath: filePath,
        });
    };

    exports.uploadEmailConfig = async (req, res) => {
        try {
            const emailTemplate = new EmailTemplate(req.body);
            await emailTemplate.save();
            res.status(200).json({ message: 'Email configuration saved successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error saving configuration', error });
        }
    };

exports.renderAndDownloadTemplate = (req, res) => {
    const { title, content, footer, imageUrl } = req.body;

    const layoutPath = path.join(__dirname, '../views/layout.html');
    const outputDir = path.join(__dirname, '../generated');

    // Ensure the 'generated' directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'email-template.html');

    // Read layout and replace placeholders
    fs.readFile(layoutPath, 'utf8', (err, html) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading layout file', error: err.message });
        }

        const renderedHtml = html
            .replace(/{{Title}}/g, title || '')
            .replace(/{{Content}}/g, content || '')
            .replace(/{{Footer}}/g, footer || '')
            .replace(/{{ImageURL}}/g, imageUrl || '');

        // Write the rendered HTML to a file
        fs.writeFile(outputPath, renderedHtml, (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ message: 'Error writing rendered HTML file', error: writeErr.message });
            }

            // Send the file as a response for download
            res.download(outputPath, 'email-template.html', (downloadErr) => {
                if (downloadErr) {
                    return res.status(500).json({ message: 'Error sending file for download', error: downloadErr.message });
                }
            });
        });
    });
};

    
