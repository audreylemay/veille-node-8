"use strict";
const peupler = require("./mes_modules/peupler");
const express = require('express');
const app = express();
const fs = require('fs');
const util = require("util");
app.use(express.static('public'));
const i18n = require("i18n");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const MongoClient = require('mongodb').MongoClient // le pilote
const ObjectID = require('mongodb').ObjectID;
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');

i18n.configure({ 
   locales : ['fr', 'en'],
   cookie : 'langueChoisie', 
   directory : __dirname + '/locales' });

/* Ajouter l'objet i18n à l'objet global «res» */
app.use(i18n.init);


let db;

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
		console.log("cookie =" + req.cookies.langueChoisie);
		res.render('accueil.ejs', {adresse: resultat})
	}) 
})

/* La route /list  permet d'afficher les adresses dans un tableau */ 
app.get('/list', (req, res) => {
	let cursor = db.collection('adresse').find().toArray(function(err, resultat) {
		if (err) return console.log(err)
		// affiche le rendu du contenu
		res.render('gabarit.ejs', {adresse: resultat})
	}) 
})

/*méthode pour ajouter une adresse*/
app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/list')
	})
})

/*méthode pour modifier une adresse*/
app.post('/modifier', (req, res) => {
	console.log('util = ' + util.inspect(req.body))
	req.body._id = ObjectID(req.body._id)

	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('sauvegarder dans la BD')
		res.redirect('/list')
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
		res.redirect('/list')
	})
})

/*méthode pour peupler la bdd */
app.get('/peupler', (req, res) => {
	let nouvelleListe = peupler();
	db.collection('adresse').insert(nouvelleListe, (err, result) => {
		if (err) return console.log(err)
		console.log("ajout d'un membre")
		res.redirect('/list')
	})
})

app.get('/profil/:id', function (req, res) {
	let id  = ObjectID(req.params.id);
	let cursor = db.collection('adresse').find({'_id': id}).toArray((err, resultat) =>{
		if (err) return console.log(err);
		//console.log(JSON.stringfy(resultat));
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD 
	  	res.render('profil.ejs', {adresse: resultat});
  	});
});

app.post('/rechercher', (req, res) => {
	console.log('util = ' + util.inspect(req.body))
	req.body._id = ObjectID(req.body._id)

	let texteRecherche = req.body.recherche;

	let requete = {
    				$or: [ 
    						{ 'prenom': {'$regex': '^' + texteRecherche,  '$options' : 'i' }},
    						{ 'nom': {'$regex': '^' + texteRecherche,  '$options' : 'i' }},
    						{ 'telephone': {'$regex': '^' + texteRecherche,  '$options' : 'i' }},
    						{ 'courriel': {'$regex': '^' + texteRecherche,  '$options' : 'i' }}
    				]
    			};

	let cursor = db.collection('adresse').find(requete).toArray((err, resultat) =>{
		if (err) return console.log(err);
		//console.log(JSON.stringfy(resultat));
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD 
	  	res.render('gabarit.ejs', {adresse: resultat});
  	});
})



app.get('/:local(en|fr)', function (req,res) {
	console.log(req.params.local);
	res.cookie('langueChoisie', req.params.local);
	res.setLocale(req.params.local);

	res.redirect(req.headers.referer);
});









