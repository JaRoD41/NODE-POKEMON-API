const { Pokemon } = require('../sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const auth = require('../../auth/auth')

module.exports = (app) => {
	app.post('/api/pokemons', auth, (req, res) => {
		const { name, hp, cp, picture, types } = req.body
		Pokemon.create({ name, hp, cp, picture, types })
			.then((pokemon) => {
				const message = `Le pokémon ${req.body.name} a bien été créé.`
				res.json({ message, data: pokemon })
			})
			.catch((error) => {
				if (error instanceof ValidationError) {
					const message = "Le pokémon n'a pas pu être créé."
					return res.status(400).json({ message, data: error })
				}
				if (error instanceof UniqueConstraintError) {
					const message = "Le pokémon n'a pas pu être créé."
					return res.status(400).json({ message, data: error })
				}
				const message = "Le pokémon n'a pas pu être créé."
				res.status(500).json({ message, data: error })
			})
	})
}
