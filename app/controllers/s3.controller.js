const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

class s3Controller {
    async addRoom(req, res, next) {
        try{
        var validated = true;
        if (!req.files) {
            res.status(403).send({ message: "please upload your file !!" });
            return;
        }
        for (let i = 0; i < req.files.length; i++){
            if (req.files[i].fieldname != "images" || req.files[i].mimetype == "application/pdf") {
                console.log(req.files[i]);
                res.status(403).send({ message: "Uploaded file is not a valid image. Only image files are allowed." });
                validated = false;
                return;
            }
        }
        
        if (!validated) return;

        var result = [];
        var base64Arr = [];
        var count = 0;

        for (let i = 0; i < req.files.length; i++){
            var arr = req.files[i].originalname.split('.');
            var extension = arr[arr.length - 1];
            const AWS = require('aws-sdk');

            const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
            const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
            const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

            const s3 = new AWS.S3({
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            });

            // file name of file needed to upload
            const fileName = uuidv4() + '.' + extension;

            function _arrayBufferToBase64( buffer ) {
                var binary = '';
                var bytes = new Uint8Array( buffer );
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode( bytes[ i ] );
                }
                return btoa(binary);
            }
            base64Arr.push(_arrayBufferToBase64(req.files[i].buffer));
            // base64Arr.push(arrayBufferToBase64(req.files[i].buffer));

            const uploadFile = new Promise((resolve, reject) => {
                const params = {
                    Bucket: AWS_BUCKET_NAME, // bucket name
                    Key: fileName, // file will be saved as bucket name/fileName
                    Body: req.files[i].buffer
                };
                s3.upload(params, (s3Err, data) => {
                    if (s3Err) {
                        reject(false);
                        return;
                    }
                    resolve(data.Location);
                    count++;
                });
            });

            const res = await uploadFile;
            result.push(res);
        }
        async function postData(url = '', data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
              method: 'POST', // *GET, POST, PUT, DELETE, etc.
              mode: 'cors', // no-cors, *cors, same-origin
              cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
              credentials: 'same-origin', // include, *same-origin, omit
              headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              redirect: 'follow', // manual, *follow, error
              referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            return response.json(); // parses JSON response into native JavaScript objects
          }
        postData('http://3.211.169.198/tagging', {base64_image_arr : base64Arr})
        .then(({data}) => {
            console.log(data); // JSON data parsed by `data.json()` call
            res.status(200).send(result);
        })
        .catch(() => res.status(503).send({message : "cannot upload your image to server"}));
        
        }catch (e){
            console.log(e);
            res.status(403).send({message : "cannot upload your image to server"});
        }
    }
}

module.exports = new s3Controller;