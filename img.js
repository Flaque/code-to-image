const webshot = require("webshot");
const fs = require("fs");
const Readable = require("stream").Readable;

module.exports = function(html) {
  return new Readable().wrap(
    webshot(html, {
      siteType: "html",
      screenSize: {
        width: 1024,
        height: 1024
      }
    })
  );
};
