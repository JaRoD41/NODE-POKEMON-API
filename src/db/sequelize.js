const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const pokemon = require('./mock-pokemon')
const bcrypt = require('bcrypt')

const sequelize = new Sequelize('pokedex', 'jarod', 'LucasRomeo', {
	host: 'localhost',
	dialect: 'mariadb',
	dialectOptions: {
		timezone: 'Etc/GMT+2',
	},
	logging: false,
})

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
	return sequelize.sync({ force: true }).then(() => {
		pokemon.forEach((poke) => {
			Pokemon.create({
				name: poke.name,
				hp: poke.hp,
				cp: poke.cp,
				picture: poke.picture,
				types: poke.types,
			})
				.then((pokemonCreated) => console.log(pokemonCreated.toJSON()))
				.catch((err) => console.error('Error creating pokemon:', err))
		})

		bcrypt.hash('pikachu', 10).then((hash) => {
			User.create({
				username: 'pikachu',
				password: hash,
			})
				.then((userCreated) => console.log(userCreated.toJSON()))
				.catch((err) => console.error('Error creating user:', err))
		})

		console.log('All models were synchronized successfully.')
	})
}

module.exports = { initDb, Pokemon, User }
