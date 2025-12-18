const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const pokemon = require('./mock-pokemon')
const bcrypt = require('bcrypt')

// 1. CONFIGURATION DE LA CONNEXION (La clé pour entrer dans le serveur)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST || 'localhost',
	// ICI : On utilise la variable d'environnement, sinon mariadb par défaut
	dialect: process.env.DB_DIALECT || 'mariadb',
	dialectOptions: {
		timezone: 'Etc/GMT+2',
	},
	logging: false,
})

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
	// En production, on évite 'force: true' pour ne pas perdre les données
	const syncOptions = process.env.NODE_ENV === 'production' ? { alter: true } : { force: true }

	return sequelize.sync(syncOptions).then(() => {
		// On ne remplit la base (Seed) que si on est en mode Développement
		if (process.env.NODE_ENV !== 'production') {
			console.log('Mode Dev : Remplissage de la BDD...')

			pokemon.forEach((poke) => {
				Pokemon.create({
					name: poke.name,
					hp: poke.hp,
					cp: poke.cp,
					picture: poke.picture,
					types: poke.types,
				}).then((pokemonCreated) => console.log(pokemonCreated.toJSON()))
			})

			// CRÉATION D'UN UTILISATEUR DE TEST POUR L'APPLICATION
			// Ce n'est pas l'admin de la BDD, c'est un compte pour tester le Login.
			bcrypt.hash('pikachu', 10).then((hash) => {
				User.create({
					username: 'pikachu', // Login pour se connecter au Front/Postman
					password: hash, // Mot de passe crypté
				}).then((userCreated) => console.log(userCreated.toJSON()))
			})
		} else {
			console.log('Mode Prod : Synchro terminée.')
		}
	})
}

module.exports = { initDb, Pokemon, User }
