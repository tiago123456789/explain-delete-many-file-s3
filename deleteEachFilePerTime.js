require("dotenv").config()

const AWS = require("aws-sdk")

var credentials = new AWS.SharedIniFileCredentials({ profile: process.env.PROFILE });
AWS.config.credentials = credentials;

const s3Client = new AWS.S3({})

const BUCKET = process.env.BUCKET

async function start() {
    const files = await s3Client.listObjects({
        Bucket: BUCKET
    }).promise();

    let keys = files.Contents;
    const key = keys[0]["Key"]
    console.log(key)

    // 700 ms
    console.time("time")
    await s3Client.deleteObject({
        Bucket: BUCKET,
        Key: key
    }).promise()
    console.timeEnd("time")

    // for (let index = 0; index < keys.length; index += 1) {
    //     const key = keys[index]["Key"]
    //     console.log(key)
    // }
    // keys = keys.map(item => ({ 'Key': item.Key }))

    // await s3Client.deleteObjects({
    //     Bucket: BUCKET,
    //     Delete: {
    //         Objects: keys
    //     }
        
    // }).promise();
}

start();