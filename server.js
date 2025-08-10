const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const UPLOADS = path.join(__dirname, 'uploads');
if(!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS);

app.use(cors());
app.use(express.static(__dirname));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, filename: req.file.filename, originalName: req.file.originalname, size: req.file.size });
});

app.get('/files', (req, res) => {
  const files = fs.readdirSync(UPLOADS).map(f => {
    const stat = fs.statSync(path.join(UPLOADS, f));
    return { filename: f, originalName: f.split('-').slice(1).join('-'), size: stat.size };
  });
  res.json(files);
});

app.get('/files/:filename', (req, res) => {
  res.download(path.join(UPLOADS, req.params.filename));
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
