const express = require('express');
const router = express.Router();
const matchMaker = require('../helpers/matchMaker');
const User = require('../models/user');

router.post('/compare', async (req, res) => {
	try {
		const userID = req.body.my_username;
		const user2_ID = req.body.other_username;

		const requestedUser = await User.findOne({
			'user_info.vibe_id': user2_ID,
		});

		if (!requestedUser) throw new Error("User doesn't exist");

		//We are safe here as we just registered the Original User
		const originalUser = await User.findOne({
			'user_info.vibe_id': userID,
		});

		const matchedObject = matchMaker(originalUser, requestedUser);
		res.status(200).send({ data: matchedObject, success: true });
	} catch (error) {
		res.status(400).send({ message: error, success: false });
	}
});

module.exports = router;
