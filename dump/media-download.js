const url = require('url');
const fs = require('fs');
const request = require('request');
const path = require('path');
const crypto = require('crypto');

const  { mediaAssetRoot } = require('../config');

function genMd5(str){
    var md5 = crypto.createHash('md5');
    var result = md5.update(str).digest('hex');
    return result;
}

function downloadMedia(fileUrl, type = 'photo'){
    const start = Date.now();
    return new Promise(resolve => {
        const { pathname } = url.parse(fileUrl);
        const extName = path.extname(pathname);
        const mediaFileName = genMd5(fileUrl);
        const medialPath = `${type}/${mediaFileName}${extName}`;
        const destPath = `${mediaAssetRoot}/${medialPath}`;
        const ws = fs.createWriteStream(destPath);
        const reqStream = request({
            url:fileUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
            }
        });
        let totolSize = 0;
        reqStream.on('data', () => {
            console.log('got some part');
        });
        reqStream.on('end', () => {
            console.log(`download done: ${medialPath} ${Date.now() - start}ms`);
            resolve(medialPath);
        });
        reqStream.on('error', (err) => {
           console.error('stream err:', err);
           resolve('');
        });
        ws.on('error', (err) => {
            console.error('ws stream err:', err);
            resolve('');
        });
        reqStream.pipe(ws);
    });   
}

module.exports = {
    downloadPhoto(photos){
        return Promose.all(photos.map(item => {
            const photoUrl = item.original_size.url;
            return downloadMedia(photoUrl, 'photo');
        }));
    }
}