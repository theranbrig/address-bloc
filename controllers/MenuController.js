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
				choices: [
					'Add new contact',
					'View all contacts',
					'Search for contact',
					"Get today's date",
					'Remind Me',
					'Exit'
				]
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
					case 'View all contacts':
						this.getContacts();
						break;
					case 'Search for contact':
						this.search();
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
				.addContact(answers.name, answers.phone, answers.email, answers.company)
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

	getContacts() {
		this.clear();
		this.book
			.getContacts()
			.then(contacts => {
				for (let contact of contacts) {
					this._printContact(contact);
				}
				this.main();
			})
			.catch(err => {
				console.log(err);
				this.main();
			});
	}

	search() {
		inquirer
			.prompt(this.book.searchQuestions)
			.then(target => {
				this.book.search(target.name).then(contact => {
					if (contact === null) {
						this.clear();
						console.log('Contact not found');
						this.search();
					} else {
						this.showContact(contact);
					}
				});
			})
			.catch(err => {
				console.log(err);
				this.main();
			});
	}

	showContact(contact) {
		this._printContact(contact);
		inquirer
			.prompt(this.book.showContactQuestions)
			.then(answer => {
				switch (answer.selected) {
					case 'Delete contact':
						this.delete(contact);
						break;
					case 'Main Menu':
						this.main();
						break;
					default:
						console.log('Something went wrong');
						this.showContact(contact);
				}
			})
			.catch(err => {
				console.log(err);
				this.showContact(contact);
			});
	}

	_printContact(contact) {
		console.log(`
				name: ${contact.name}
				phone number: ${contact.phone}
				email: ${contact.email}
				company: ${contact.company}
				-----------------------------------`);
	}

	delete(contact) {
		inquirer
			.prompt(this.book.confirmDeleteQuestions)
			.then(answer => {
				if (answer.confirmation) {
					this.book.delete(contact.id);
					console.log('Contact Deleted');
					this.main();
				} else {
					console.log('Contact not deleted');
					this.showContact(contact);
				}
			})
			.catch(err => {
				console.log(err);
				this.main();
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
		this.clear();
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
