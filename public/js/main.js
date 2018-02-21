let btnsSave = document.querySelectorAll('.sauver')
console.log('elmSauver = ' + btnsSave.length)
for (let btn of btnsSave) {
	btn.addEventListener('click', function(event) {

		event.preventDefault();

		let laLigne = btn.parentNode.parentNode;
		let id = laLigne.children[0].innerHTML;
		let nom = laLigne.children[1].innerHTML;
		let prenom = laLigne.children[2].innerHTML;
		let telephone = laLigne.children[3].innerHTML;
		let courriel = laLigne.children[4].innerHTML;

		let elmForm = document.getElementById('mon_formulaire');
		let elmInput = elmForm.querySelectorAll('input');
		elmInput[0].value = id;
		elmInput[1].value = nom;
		elmInput[2].value = prenom;
		elmInput[3].value = telephone;
		elmInput[4].value = courriel;

		elmForm.submit();
	})
} 