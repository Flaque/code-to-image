function error(message) {
  return {
    status: 500,
    message: message
  };
}

function success(url) {
  return {
    status: 200,
    url: url
  };
}

module.exports = {
  success,
  error
};
