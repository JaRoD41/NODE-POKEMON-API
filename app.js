const express = require('express')
const morgan = require('morgan')
const favicons = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')

const app = express()
const port = 3000

app
	.use(favicons(__dirname + '/favicon.ico'))
	.use(morgan('dev'))
	.use(bodyParser.json())

sequelize.initDb()

// Endpoints
require('./src/db/routes/findAllPokemons')(app)
require('./src/db/routes/findPokemonByPk')(app)
require('./src/db/routes/createPokemon')(app)
require('./src/db/routes/updatePokemon')(app)
require('./src/db/routes/deletePokemon')(app)
require('./src/db/routes/login')(app)

// Middleware pour capturer les routes non définies (404)
app.use((req, res, next) => {
	const error = new Error('Not Found')
	error.status = 404
	next(error)
})

// Middleware d'erreur (doit être le dernier app.use)
app.use((err, req, res, next) => {
	const status = err.status || 500
	const message = err.message
	res.status(status).json({ message })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
