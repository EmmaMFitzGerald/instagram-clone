var AWS = require("aws-sdk");
var path = require('path');
var fs = require('fs');
var path = require('path');

export function uploadPicture(){ 
    AWS.config.update({region: 'us-east-1'});

    let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    var uploadParams = {Bucket: "instagram-clone-bucket-emma", Key: '', Body: ''};
    var file = "uploads/0ce7041f0977100992be15d054014297";


    var fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err: any) {
    console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);

    s3.upload (uploadParams, function (err: any, data: { Location: any; }) {
        if (err) {
          console.log("Error", err);
        } if (data) {
          console.log("Upload Success", data.Location);
        }
    });
};