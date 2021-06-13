const https = require('https');
const zlib = require('zlib');

const fetchData = async (url, decompress) => {
    return await new Promise((resolve, reject) => {
        let dataString = '';
        const req = https.get(url, function (res) {

            const onData = (data) => {
                dataString += data.toString();
            }
            const onEnd = () => {
                resolve({
                    statusCode: 200,
                    body: JSON.parse(dataString)
                });
            }
            if (decompress) {
                const gunzip = zlib.createGunzip();
                res.pipe(gunzip);
                gunzip.on('data', onData).on("end", onEnd);
            } else {
                res.on('data', onData).on('end', onEnd);
            }
        });

        req.on('error', (e) => {
            reject({
                statusCode: 500,
                body: 'Something went wrong!'
            });
        });
    });
}

const webService = {
    fetchData: fetchData,
}

module.exports = webService;
