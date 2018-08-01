const inquirer = require('inquirer');
const moment = require('moment');

module.exports = class menuController {
	constructor() {
		this.mainMenuQuestions = [
			{
				type: 'list',
				name: 'mainMenuChoice',
				message: 'Please choose from an option below:',
				choices: ['Add new contact', "Get today's date", 'Exit']
			}
		];
	}

	main() {
		console.log('Welcome to AddressBloc!');
		inquirer
			.prompt(this.mainMenuQuestions)
			.then(response => {
				switch (response.mainMenuChoice) {
					case 'Add new contact':
						this.addContact();
						break;
					case 'Exit':
						this.exit();
						break;
					case "Get today's date":
						this.getDate();
						break;
					default:
						console.log('Invalid input');
						break;
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	clear() {
		console.log('\x1Bc');
	}

	addContact() {
		this.clear();
		console.log('addContact called');
		this.main();
	}

	exit() {
		console.log('Thanks for using Address Bloc');
		process.exit();
	}

	getDate() {
		this.clear();
		console.log(`Today is: ${moment().format('LL')}`);
		this.main();
	}

	// Vanilla JS - Not used since the above syntax is much shorter and I wanted to be importing NPM modules for this assignment.

	// getDate() {
	// 	let currentDate = new Date();
	// 	let day = currentDate.getDate();
	// 	let month = currentDate.getMonth() + 1;
	// 	let year = currentDate.getFullYear();
	// 	this.clear();
	// 	console.log(`Today is ${day}/${month}/${year}`);
	// 	this.main();
	// }
};
