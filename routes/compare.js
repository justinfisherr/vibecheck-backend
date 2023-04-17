const express = require('express');
const router = express.Router();
const getMatched = require("../middleware/getMatched");

		const matchedObject = matchMaker(originalUser, requestedUser);
		res.status(200).send({ data: matchedObject, success: true });
	} catch (error) {
		res.status(400).send({ message: error, success: false });
	}
});

module.exports = router;
