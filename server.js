const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Clean URL routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog', 'blog.html'));
});

app.get('/blog/articles/google-student-ambassador', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog', 'articles', 'blog-GoogleStudentAmbassador .html'));
});

// Fallback for other HTML files (remove .html extension)
app.get('*', (req, res, next) => {
    if (req.path.indexOf('.') === -1) {
        const htmlPath = path.join(__dirname, req.path + '.html');
        res.sendFile(htmlPath, (err) => {
            if (err) {
                next();
            }
        });
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
