require("dotenv").config()
const AWS = require("aws-sdk")

var credentials = new AWS.SharedIniFileCredentials({ profile: process.env.PROFILE });
AWS.config.credentials = credentials;

const s3Client = new AWS.S3({})

const BUCKET = process.env.BUCKET

async function start() {
    console.time("time")
    const files = await s3Client.listObjects({
        Bucket: BUCKET
    }).promise();

    let keys = files.Contents;
    keys = keys.map(item => ({ 'Key': item.Key }))

    await s3Client.deleteObjects({
        Bucket: BUCKET,
        Delete: {
            Objects: keys
        }
        
    }).promise();
    console.timeEnd("time")
}

start();