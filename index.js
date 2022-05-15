const express = require('express');
const https = require('https');
const http = require('http');
const app = express();
const router = express.Router();
// const multer = require('./multer');

router.post('/file', async function (req, res) {
    try {
        let startTime = new Date().getTime();
        const url = new URL(`http://127.0.0.1:9000/upload`);
        const [contentType, contentLength] = [req.headers['content-type'], req.headers['content-length']];
        const options = {
            protocol: url.protocol,
            method: 'post',
            host: url.hostname,
            path: url.pathname,
            timeout: 5000,
            headers: {
                'Content-Type': contentType,
                'Content-Length': contentLength,
            }
        };
        if (url.port)   options.port = url.port;
        if (url.search) options.path = options.path + url.search;
        const httpClient = (url.protocol || 'https').includes('https') ? https : http;

        const result = await new Promise((resolve, reject) => {
            let request = httpClient.request(options, function(resp){
                let str='';
                resp.on('data',function(buffer){
                    str+=buffer;
                });
                resp.on('end',()=>{
                    try {
                        let { code, data, message } = JSON.parse(str);
                        console.log('上传文件的结果:', { code, data, message });
                        console.log('数据上传完毕,耗时(毫秒):', new Date().getTime() - startTime);
                        resolve(data);
                    } catch (e) {
                        return reject(e);
                    }
                });
                resp.on('error', (err) => {
                    console.log('发生了异常')
                    console.error(error);
                    return reject(err);
                });
            });
            request.on('error', (err) => {
                console.error('原始请求出错:', err);
                return reject(err);
            });
            // TODO 但需要修改数据是需要在这里做操作, 但是这个方法有问题还需要修复这个bug
            // let flag = true;
            // req.on('data', (data) => {
            //     if(flag) {
            //         const index = data.indexOf('\r\n\r\n');
            //         const slice = data.slice(0, index);
            //         let [line1, line2, line3] = slice.toString().split('\n');
            //         let [desc, filed_name, filename] = line2.split('; ');
            //         let buff = Buffer.from([line1, [desc, 'name="file"', filename].join('; '), line3].join('\n'));
            //         const buffer = Buffer.concat([buff, data.slice(index)]);
            //         flag = false;
            //         request.write(buffer);
            //     } else {
            //         request.write(data);
            //     }
            // });

            req.on('end', () => {
                console.log('数据接收完毕,耗时（毫秒）:', new Date().getTime() - startTime );
            });

            // 如果不需要修改内容可以直接使用管道流操作
            req.pipe(request);
        });
        let endTime = new Date().getTime();
        console.log('上传文件总用时:', endTime - startTime , 'ms');
    
        res.json("ok");
    } catch (err) {
        console.error(err);
        res.json(JSON.stringify(err));
    }
});

// app.use('/multer', multer);
app.use('/', router);
app.listen(3000, () => {
    console.log('listening on port 3000');
});