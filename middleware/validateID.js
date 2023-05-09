const formatRegex = /^(?!v\d{1,7}$)[a-zA-Z0-9]{3,15}$/;
/**
 * validateID - checks if the requested new id is of proper format
 * @format - ID must be 3-15 characters in length
 *         - ID must NOT start with a v and be followed by 7 0s
 *         - ID must contain NO special characters including space
 *
 * @param id - the requested newID.
 */
function validateID(req, res, next) {
  const id = req.body.newID;
  if (formatRegex.test(id)) next();
  else res.status(400).send({ message: "Improper Formatting", success: false });
}
module.exports = validateID;
