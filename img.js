const webshot = require("webshot");
const fs = require("fs");

module.exports = function(html) {
  return new Promise((resolve, reject) => {
    const stream = webshot(html, {
      siteType: "html",
      screenSize: {
        width: 320
      }
    });

    stream.on("data", data => resolve(data));
  });
};
