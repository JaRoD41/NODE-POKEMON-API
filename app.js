require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
})

const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')
const cors = require('cors')

const app = express()

// 1. LE PORT : On utilise celui de l'environnement, sinon 3000 par défaut
const port = process.env.PORT || 3000

app.use(bodyParser.json()).use(cors())

// 2. LA BDD : On initialise la connexion
// Je m'assure que mon fichier sequelize.js utilise bien les variables d'environnement qu'on a définies
sequelize.initDb()

app.get('/', (req, res) => {
	res.json({ message: 'API Pokemon en ligne sur o2switch !' })
})

// Vos routes
require('./src/db/routes/findAllPokemons')(app)
require('./src/db/routes/findPokemonByPk')(app)
require('./src/db/routes/createPokemon')(app)
require('./src/db/routes/updatePokemon')(app)
require('./src/db/routes/deletePokemon')(app)
require('./src/db/routes/login')(app)

// Gestion des erreurs 404
app.use((req, res) => {
	const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.'
	res.status(404).json({ message })
})

// 3. LE DEMARRAGE : C'est OBLIGATOIRE sur o2switch contrairement à ce qu'on m'a dit.
// Sans ça, le script s'arrête et Passenger relance l'app en boucle (crash).
app.listen(port, () => {
	console.log(`Serveur démarré sur le port ${port}`)
})

module.exports = app
