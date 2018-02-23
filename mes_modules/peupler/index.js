"use strict";

const tableau = require("./tableaux.js");

console.log(tableau.tabNom);
console.log(tableau.tabPrenom);
console.log(tableau.tabTel);
console.log(tableau.tabEmail);

const maxNom = tableau.tabNom.length;
const maxPrenom = tableau.tabPrenom.length;
const maxTel = tableau.tabTel.length;
const maxEmail = tableau.tabEmail.length;

const peupler = () => {

	console.log("fonction peupler");

	let positionNom = Math.floor(Math.random() * maxNom);
	let nom = tableau.tabNom[positionNom];

	let positionPrenom = Math.floor(Math.random() * maxPrenom);
	let prenom = tableau.tabPrenom[positionPrenom];

	let positionTel = Math.floor(Math.random() * maxTel);
	let tel = tableau.tabTel[positionTel];

	let positionEmail = Math.floor(Math.random() * maxEmail);
	let email = tableau.tabEmail[positionEmail];



	return {
		nom : nom, 
		prenom : prenom,
		telephone : tel,
		courriel : email
	}


}

module.exports = peupler;
