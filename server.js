const uuid = require("uuid/v4");
const streamLength = require("stream-length");
const tmpl = require("./tmpl");
const img = require("./img");
const { success, error } = require("./response");

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
  const stream = img(html);

  // Configure s3
  const params = {
    Key: `${uuid()}.png`,
    Body: stream,
    ContentType: "image/png"
  };

  s3.upload(params, (err, data) => {
    if (err) {
      res.send(error(err));
    }
    res.send(success(data.Location));
  });
});

// Listen and start!
app.listen(8000, () => console.log("code-to-cloth listening on port 8000!"));
