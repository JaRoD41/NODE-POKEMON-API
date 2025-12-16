const jwt = require('jsonwebtoken')
const privateKey = require('./private_key')

module.exports = (req, res, next) => {
	const authorizationHeader = req.headers.authorization

	if (!authorizationHeader) {
		return res.status(401).json({ message: 'No token provided!' })
	}

	const token = authorizationHeader.split(' ')[1]
	jwt.verify(token, privateKey, (error, decodedToken) => {
		if (error) {
			return res.status(401).json({ message: 'Invalid token!' })
		}

		req.userId = decodedToken.id
		next()
	})
}
