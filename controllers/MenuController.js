const inquirer = require('inquirer');
const moment = require('moment');
const ContactController = require('./ContactController');

module.exports = class menuController {
	constructor() {
		this.mainMenuQuestions = [
			{
				type: 'list',
				name: 'mainMenuChoice',
				message: 'Please choose from an option below:',
				choices: ['Add new contact', "Get today's date", 'Remind Me', 'Exit']
			}
		];
		this.book = new ContactController();
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
					case 'Remind Me':
						this.remindMe();
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
		inquirer.prompt(this.book.addContactQuestions).then(answers => {
			this.book
				.addContact(answers.name, answers.phone)
				.then(contact => {
					console.log('Contact added successfully!');
					this.main();
				})
				.catch(err => {
					console.log(err);
					this.main();
				});
		});
	}

	exit() {
		console.log('Thanks for using Address Bloc');
		process.exit();
	}

	getContactCount() {
		return this.contacts.length;
	}

	remindMe() {
		let message = `Learning is a life-long pursuit`;
		console.log(message);
		this.main();
		return message;
	}

	getDate() {
		this.clear();
		console.log(`Today is: ${moment().format('LL')}`);
		this.main();
	}
};
