const { User } = require('../sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../../auth/private_key')

module.exports = (app) => {
	app.post('/api/login', async (req, res) => {
		User.findOne({ where: { username: req.body.username } })
			.then((user) => {
				if (!user) {
					return res.status(404).json({ message: 'User not found!' })
				}
				bcrypt.compare(req.body.password, user.password).then((isPasswordValid) => {
					if (!isPasswordValid) {
						return res.status(401).json({ message: 'Invalid password!' })
					}

					// JWT

					const token = jwt.sign({ id: user.id }, privateKey, { expiresIn: '24h' })

					if (isPasswordValid) {
						return res.status(200).json({ message: 'Login successful!', user, token })
					}
				})
			})
			.catch((err) => {
				const message = 'An error occurred during login.'
				res.status(500).json({ message, data: err })
			})
	})
}
