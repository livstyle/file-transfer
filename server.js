const express = require('express');
const path = require('path');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        console.log(file);
        const parseFile = path.parse(file.originalname);
        cb(null, Date.now() + '-' + parseFile.ext);
    }
});
const upload = multer({ storage });

const app = express();

const router = express.Router();

router.post('/upload', upload.single('file'), async function(req, res) {
    res.json({ code: 0, message: "ok" });
});

app.use('/', router);

app.listen(9000, () => {
    console.log('listening on port 9000');
});