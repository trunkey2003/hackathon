const { v4: uuidv4 } = require('uuid');

class s3Controller {
    uploadImage(req, res, next) {
        var validated = true;
        if (!req.files) {
            res.status(403).send({ message: "please upload your file !!" });
            return;
        }
        for (let i = 0; i < req.files.length; i++){
            if (req.files[i].fieldname != "image" || req.files[i].mimetype == "application/pdf") {
                console.log(req.files[i]);
                res.status(403).send({ message: "Uploaded file is not a valid image. Only image files are allowed." });
                validated = false;
                return;
            }
        }
        
        if (!validated) return;

        const arr = [];

        req.files.forEach((file) => {
            var arr = req.files.originalname.split('.');
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

            const uploadFile = () => {
                const params = {
                    Bucket: AWS_BUCKET_NAME, // bucket name
                    Key: fileName, // file will be saved as bucket name/fileName
                    Body: req.files.buffer
                };
                s3.upload(params, function (s3Err, data) {
                    if (s3Err) {
                        res.status(403).send(s3Err);
                        return;
                    }
                    arr.push(data.Location);
                });
            };

            uploadFile();
        })

        res.send(arr);
    }
}

module.exports = new s3Controller;