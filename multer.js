const express = require('express');
const router = express.Router();

const axios = require('axios');
const FormData = require("form-data");

const path = require("path");
const fs = require("fs");

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './uploads'));
    },
    filename: function (req, file, cb) {
        const { file_name } = req.query;
        cb(null, file_name)
    }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), async function(req, res) {

    const { file_name } = req.query;

    let start_time = new Date().getTime();

    let file_url = 'http://localhost:9000/upload';

    const form = new FormData();
    form.append("file", fs.createReadStream(path.join(__dirname, './uploads/', file_name)));
  
    let r = await axios({
      method: "post",
      url: `${file_url}`,
      data: form,
      maxBodyLength: Infinity,
      headers: form.getHeaders()
    }).then(v => v.data);

    let end_time = new Date().getTime();

    console.log('axios 上传文件耗时:', end_time - start_time);

    console.log(r);

    res.json({ code: 200, message: "ok" });
});

module.exports = router;