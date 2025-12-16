const { Pokemon } = require('../sequelize')
const { Op, or } = require('sequelize')
const auth = require('../../auth/auth')

module.exports = (app) => {
	app.get('/api/pokemons', auth, (req, res) => {
		if (req.query.name) {
			const name = req.query.name
			const length = name.length
			const limit = req.query.limit ? parseInt(req.query.limit) : 5

			if (length < 2) {
				const message = "Merci d'entrer au moins 2 caractères pour la recherche."
				return res.status(400).json({ message })
			}

			return Pokemon.findAndCountAll({
				where: {
					name: {
						[Op.like]: `%${name}%`,
					},
				},
				order: ['name'],
				limit: limit,
			})
				.then(({ count, rows }) => {
					const message =
						count > 1 ? `Il y a ${count} pokémons qui correspondent.` : `Il y a ${count} pokémon qui correspond.`
					res.json({ message, data: rows })
				})
				.catch((error) => {
					const message = "La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants."
					res.status(500).json({ message, data: error })
				})
		} else {
			Pokemon.findAll({ order: ['name'] })
				.then((pokemons) => {
					const message = `La liste des ${pokemons.length} pokémon(s) a été récupérée.`
					res.json({ message, data: pokemons })
				})
				.catch((error) => {
					const message = "La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants."
					res.status(500).json({ message, data: error })
				})
		}
	})
}
