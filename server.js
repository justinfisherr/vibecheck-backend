require('dotenv').config();
const express = require('express');
const app = express();
const databaseConnect = require('./database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

databaseConnect();

const authRouter = require('./routes/auth');
const compareRouter = require('./routes/compare');
const usersRouter = require('./routes/getUsers');
app
	.use(express.json())
	.use(cors())
	.use(cookieParser())
	.use(authRouter)
	.use(compareRouter)
	.use(usersRouter);

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
// 	app.use(express.static('front-end/build'));

// 	app.get('*', (req, res) => {
// 		res.sendFile(
// 			path.resolve(__dirname, 'vibe-chek-frontend', 'build', 'index.html')
// 		);
// 	});
// }

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
