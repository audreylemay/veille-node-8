"use strict";
const peupler = require("./mes_modules/peupler");
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

// test de la fonction peupler
console.log("dans main.js :" + util.inspect(peupler().nom));

/* La route / par défaut permet d'afficher la page d'accueil */ 
app.get('/', (req, res) => {
	let cursor = db.collection('adresse').find().toArray(function(err, resultat) {
		if (err) return console.log(err)
		// affiche le rendu du contenu
		res.render('gabarit.ejs', {adresse: resultat})
	}) 
})

/* La route /list  permet d'afficher les adresses dans un tableau */ 
app.get('/list', (req, res) => {
	let cursor = db.collection('adresse').find().toArray(function(err, resultat) {
		if (err) return console.log(err)
		// affiche le rendu du contenu
		res.render('gabarit_adresse.ejs', {adresse: resultat})
	}) 
})

/*méthode pour ajouter une adresse*/
app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/')
	})
})

/*méthode pour modifier une adresse*/
app.post('/modifier', (req, res) => {
	console.log('util = ' + util.inspect(req.body))
	req.body._id = ObjectID(req.body._id)

	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/')
	})
})

/*méthode pour supprimer une adresse*/
app.get('/delete/:id', (req, res) => {
	var critere = ObjectID(req.params.id)

	db.collection('adresse').findOneAndDelete( {'_id': critere} ,(err, resultat) => {
		if (err) return res.send(500, err)
		var cursor = db.collection('adresse').find().toArray(function(err, resultat) {
			if (err) return console.log(err)
			res.render('gabarit.ejs', {adresse: resultat})
		})
	})
})

/*méthode pour trier les adresses*/
app.get('/trier/:cle/:ordre', (req, res) => {
	let cle = req.params.cle
	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat) {
		ordre = (req.params.ordre == "asc" ? "desc" : "asc")
		res.render('gabarit.ejs', {adresse: resultat, cle, ordre})
	})
})

/*méthode pour supprimer tout les adresses*/
app.get('/vider', (req, res) => {
	db.collection('adresse').remove(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('collection supprimée')
		res.redirect('/')
	})
})

/*méthode pour peupler la bdd */
app.get('/peupler', (req, res) => {
	let nouvelleListe = peupler();
	db.collection('adresse').insert(nouvelleListe, (err, result) => {
		if (err) return console.log(err)
		console.log("ajout d'un membre")
		res.redirect('/')
	})
})





