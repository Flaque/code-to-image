const uuid = require("uuid/v4");
const streamLength = require("stream-length");
const tmpl = require("./tmpl");
const img = require("./img");

// Kill other AWS variables and just use the ones
// defined in ~/.aws/credentials
if (process.env.NODE_ENV === "development") {
  Object.keys(process.env).forEach(
    key => (0 === key.indexOf("AWS_") ? delete process.env[key] : null)
  );
}

// AWS
const aws = require("aws-sdk");

if (process.env.NODE_ENV === "production") {
  aws.config.accessKeyId = process.env.accessKeyId;
  aws.config.secretAccessKey = process.env.secretAccessKey;
  aws.config.region = process.env.region;
}

// S3
const BUCKET_NAME = "text-to-image";
const s3 = new aws.S3({
  params: { Bucket: BUCKET_NAME }
});

console.log(s3.config.credentials);

// Express
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Main function
app.post("/", (req, res) => {
  const { code, background, color } = req.body;
  const html = tmpl(code, background, color);

  // Create the Image to upload to s3
  img(html).then(data => {
    // Configure s3
    const params = {
      Key: `${uuid()}.png`,
      Body: data,
      ContentType: "image/png"
    };

    s3.putObject(params, (err, data) => {
      if (err) {
        res.send(err);
      }

      res.send("https://s3.amazonaws.com/" + BUCKET_NAME + "/" + params.Key);
    });
  });
});

// Listen and start!
app.listen(8000, () => console.log("Example app listening on port 8000!"));
