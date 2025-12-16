const { Pokemon } = require('../sequelize')
const auth = require('../../auth/auth')

module.exports = (app) => {
	app.get('/api/pokemons/:id', auth, (req, res) => {
		const { id } = req.params
		Pokemon.findByPk(id)
			.then((pokemon) => {
				if (!pokemon) {
					const message = "Le pokémon n'existe pas."
					return res.status(404).json({ message })
				}
				const message = 'Le pokémon a bien été récupéré.'
				res.json({ message, data: pokemon })
			})
			.catch((error) => {
				const message = "Le pokémon n'a pas pu être récupéré."
				res.status(500).json({ message, data: error })
			})
	})
}
