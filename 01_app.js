const express = require('express');
const app = express();
const fs = require('fs');
const util = require("util");
app.use(express.static('public'));

const MongoClient = require('mongodb').MongoClient // le pilote
const ObjectID = require('mongodb').ObjectID;
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');

let db

MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081')
	})
})

// engin de vue par défaut ejs , sert à génrer des templates
app.set('view engine', 'ejs'); 

/* La route / par défaut permet d'afficher les adresses dans un tableau */ 
app.get('/', (req, res) => {
	let cursor = db.collection('adresse').find().toArray(function(err, resultat) {
		if (err) return console.log(err)
		// affiche le rendu du contenu
		res.render('gabarit.ejs', {adresse: resultat})
	}) 
})


app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/')
	})
})

