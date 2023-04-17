const formatRegex = /^(?!v\d{1,7}$)[a-zA-Z0-9]{3,15}$/;
function validateID(req, res, next) {
  const id = req.body.newID;
  if (formatRegex.test(id)) next();
  else res.status(400).send({ message: "Improper Formatting", success: false });
}
module.exports = validateID;
