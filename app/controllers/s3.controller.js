const { v4: uuidv4 } = require('uuid');

class s3Controller {
    async uploadImage(req, res, next) {
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
        res.status(200).send(result);
        }catch{
            res.status(403).send({message : "cannot upload your image to server"});
        }
    }
}

module.exports = new s3Controller;