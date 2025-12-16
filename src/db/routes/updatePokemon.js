const { Pokemon } = require('../sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const auth = require('../../auth/auth')

module.exports = (app) => {
	app.put('/api/pokemons/:id', auth, (req, res) => {
		const id = req.params.id

		// Vérifier que le pokémon existe
		Pokemon.findByPk(id)
			.then((pokemon) => {
				if (!pokemon) {
					const message = "Le pokémon n'existe pas."
					return res.status(404).json({ message })
				}

				// Mettre à jour le pokémon
				return Pokemon.update(req.body, { where: { id: id } })
					.then(() => {
						return Pokemon.findByPk(id)
					})
					.then((updatedPokemon) => {
						const message = `Le pokémon a bien été mis à jour.`
						res.json({ message, data: updatedPokemon })
					})
					.catch((error) => {
						if (error instanceof ValidationError) {
							const message = 'Erreur lors de la mise à jour du pokémon.'
							return res.status(400).json({ message: message, data: error })
						}
						if (error instanceof UniqueConstraintError) {
							const message = 'Erreur lors de la mise à jour du pokémon.'
							return res.status(400).json({ message: message, data: error })
						}
						const message = 'Erreur lors de la mise à jour du pokémon.'
						res.status(500).json({ message, data: error.message })
					})
			})
			.catch((error) => {
				const message = "Le pokémon n'a pas pu être récupéré."
				res.status(500).json({ message, data: error.message })
			})
	})
}
