const { Pokemon } = require('../sequelize')
const auth = require('../../auth/auth')

module.exports = (app) => {
	app.delete('/api/pokemons/:id', auth, (req, res) => {
		Pokemon.findByPk(req.params.id)
			.then((pokemon) => {
				if (!pokemon) {
					const message = "Le pokémon n'existe pas."
					return res.status(404).json({ message })
				}
				return Pokemon.destroy({ where: { id: pokemon.id } })
					.then(() => {
						const message = `Le pokemon avec l'id ${pokemon.id} a bien été supprimé.`
						res.json({ message, data: pokemon })
					})
					.catch((error) => {
						const message = "Le pokemon n'a pas pu être supprimé."
						res.status(500).json({ message, data: error })
					})
			})
			.catch((error) => {
				const message = "Le pokemon n'a pas pu être supprimé."
				res.status(500).json({ message, data: error })
			})
	})
}
