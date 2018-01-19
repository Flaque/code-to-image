const fs = require("fs");
const Mustache = require("mustache");

const tmpl = fs.readFileSync("code.mustache", "utf8"); // TODO maybe not sync

/**
 * Returns a templated out html
 */
module.exports = function(code, background = "white", color = "black") {
  return Mustache.render(tmpl, {
    code,
    background,
    color
  });
};
