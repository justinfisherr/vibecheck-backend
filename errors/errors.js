function parseError(error) {
  if (error.body != undefined && error.body.error.status === 400)
    return Object.create(Error.prototype, {
      name: { value: "Spotify Parser Error", enumerable: true },
      type: { value: "parse", enumerable: true },
      message: { value: error, enumerable: true },
    });
  else {
    return Object.create(Error.prototype, {
      name: { value: "Generic", enumerable: true },
      type: { value: "vibe check parsing function error", enumerable: true },
      message: { value: error, enumerable: true },
    });
  }
}
module.exports = parseError;
