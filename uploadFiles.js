require("dotenv").config()
const AWS = require("aws-sdk")
const fs = require("fs/promises")
const { randomUUID } = require("crypto")

var credentials = new AWS.SharedIniFileCredentials({ profile: process.env.PROFILE });
AWS.config.credentials = credentials;

const s3Client = new AWS.S3({})


const BUCKET = process.env.BUCKET

async function start() {
    const buffer = await fs.readFile("./fake.txt")

    let promisesToUpload = []
    for (let index = 0; index < 100; index +=1) {

        promisesToUpload.push(
            s3Client.putObject({
                Bucket: BUCKET,
                Key: `${randomUUID()}.txt`,
                Body: buffer,
                ContentType: "text/plain"
            }).promise()
        )

        if (promisesToUpload.length === 10) {
            await Promise.all(promisesToUpload);
            promisesToUpload = []
        }
    }

    if (promisesToUpload.length > 0) {
        await Promise.all(promisesToUpload);
        promisesToUpload = []
    }

}

start();