const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MOVIE_DIR = path.join(__dirname, 'media');

// Middleware to serve static files
app.use(express.static('public'));

// Auto-discover movies in the media folder and serve them as a list
app.get('/movies', (req, res) => {
    fs.readdir(MOVIE_DIR, (err, files) => {
        if (err) return res.status(500).send('Unable to scan directory: ' + err);
        const movies = files.filter(file => file.endsWith('.mp4'));
        res.json(movies);
    });
});

// Stream a movie with Range support
app.get('/stream/:movie', (req, res) => {
    const movie = req.params.movie;
    const moviePath = path.join(MOVIE_DIR, movie);

    fs.stat(moviePath, (err, stats) => {
        if (err) {
            return res.status(404).send('Movie not found');
        }

        const range = req.headers.range;
        if (!range) {
            return res.status(416).send('Range not specified');
        }

        const start = Number(range.replace(/bytes=/, '').split('-')[0]);
        const end = stats.size - 1;

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${stats.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': (end - start) + 1,
            'Content-Type': 'video/mp4'
        });

        const stream = fs.createReadStream(moviePath, { start, end });
        stream.pipe(res);
        stream.on('error', () => res.end());
    });
});

// Download a movie
app.get('/download/:movie', (req, res) => {
    const movie = req.params.movie;
    const moviePath = path.join(MOVIE_DIR, movie);
    res.download(moviePath, movie); // Set disposition and send it
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});