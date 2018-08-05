const ContactController = require('../controllers/ContactController');
const sequelize = require('../db/models/index').sequelize;

describe('ContactController', () => {
	// Define book from Contact Controller

	beforeEach(done => {
		this.book = new ContactController();
		sequelize
			.sync({ force: true })
			.then(res => {
				done();
			})
			.catch(err => {
				done();
			});
	});

	// Add Contact Test

	describe('#addContact()', () => {
		it('should add a single contact into the book', done => {
			this.book
				.addContact('Alice', '001-101-1010', 'alice@mail.com', 'Google')
				.then(contact => {
					expect(contact.name).toBe('Alice');
					expect(contact.phone).toBe('001-101-1010');
					expect(contact.email).toBe('alice@mail.com');
					expect(contact.company).toBe('Google');
					done();
				})
				.catch(err => {
					done();
				});
		});
	});

	// Get Contacts Tests

	describe('#getContacts()', () => {
		it('should return an empty array when no contacts are available', () => {
			this.book
				.getContacts()
				.then(contacts => {
					expect(contacts.length).toBe(0);
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});
		it('should return an array of contacts when contacts are available', () => {
			this.book
				.addContact('Alice', '001-101-1010', 'alice@mail.com', 'Google')
				.then(() => {
					this.book.getContacts().then(contacts => {
						expect(contacts.length).toBe(1);
						done();
					});
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});

		// Search Function Tests

		describe('search methods', () => {
			const zelda = [
				'Zelda Smith',
				'000-100-111',
				'zelda@nintendo.com',
				'Nintendo'
			];
			const snake = [
				'Solid Snake',
				'100-100-100',
				'snake@konami.com',
				'Konami'
			];
			const magus = [
				'Magus Johnson',
				'101-010-101',
				'magus@squaresoft.com',
				'Squaresoft'
			];
			const alloy = [
				'Alloy Rodriguez',
				'111-111-111',
				'allow@guerrilla-games.com',
				'Guerilla'
			];

			// Binary Search Methods

			describe('binarySearch()', () => {
				function sort(contacts) {
					return contacts.sort((a, b) => {
						if (a.name > b.name) return 1;
						else if (a.name < b.name) return -1;
						else return 0;
					});
				}
				it('should return null when called with an empty array', () => {
					expect(this.book.binarySearch([], 'Alloy Rodriguez')).toBeNull();
				});
				it('should return null when contact is not found', done => {
					this.book.addContact(...zelda).then(() => {
						this.book
							.getContacts()
							.then(contacts => {
								expect(
									this.book.binarySearch(sort(contacts), 'Alloy Rodgriguez')
								).toBeNull();
								done();
							})
							.catch(err => {
								console.log(err);
								done();
							});
					});
				});
				it('should return the contact if found', done => {
					this.book.addContact(...alloy).then(() => {
						this.book.addContact(...magus).then(() => {
							this.book.addContact(...zelda).then(() => {
								this.book.addContact(...snake).then(() => {
									this.book
										.getContacts()
										.then(contacts => {
											let contact = this.book.binarySearch(
												sort(contacts),
												'Magus Johnson'
											);
											expect(contact.name).toBe('Magus Johnson');
											expect(contact.phone).toBe('101-010-101');
											expect(contact.email).toBe('magus@squaresoft.com');
											expect(contact.company).toBe('Squaresoft');
											done();
										})
										.catch(err => {
											console.log(err);
											done();
										});
								});
							});
						});
					});
				});
			});

			//Iterative Search Methods

			describe('#iterativeSearch()', () => {
				it('should return null when called with an empty array', () => {
					expect(this.book.iterativeSearch([], 'Alloy')).toBeNull();
				});
				it('should return null when contact is not found', done => {
					this.book.addContact(...zelda).then(() => {
						this.book
							.getContacts()
							.then(contacts => {
								expect(
									this.book.iterativeSearch(contacts, 'Alloy Rodriguez')
								).toBeNull();
								done();
							})
							.catch(err => {
								console.log(err);
								done();
							});
					});
				});

				it('should return the contact if found', done => {
					this.book.addContact(...alloy).then(() => {
						this.book.addContact(...magus).then(() => {
							this.book
								.getContacts()
								.then(contacts => {
									let contact = this.book.iterativeSearch(
										contacts,
										'Magus Johnson'
									);
									expect(contact.name).toBe('Magus Johnson');
									expect(contact.phone).toBe('101-010-101');
									expect(contact.email).toBe('magus@squaresoft.com');
									done();
								})
								.catch(err => {
									console.log(err);
									done();
								});
						});
					});
				});
			});
			describe('#search()', () => {
				it('should return null when a contact was not found', done => {
					this.book.addContact(...zelda).then(() => {
						this.book
							.search('Solid Snake')
							.then(contact => {
								expect(contact).toBeNull();
								done();
							})
							.catch(err => {
								console.log(err);
								done();
							});
					});
				});
				it('should return the contact when found', done => {
					this.book.addContact(...snake).then(() => {
						this.book
							.search('Solid Snake')
							.then(contact => {
								expect(contact).not.toBeNull();
								expect(contact.name).toBe('Solid Snake');
								expect(contact.phone).toBe('100-100-100');
								expect(contact.email).toBe('snake@konami.com');
								expect(contact.company).toBe('Konami');
								done();
							})
							.catch(err => {
								console.log(err);
								done();
							});
					});
				});
			});
		});

		// Delete Contact tests

		describe('#delete()', () => {
			it('should not remove any contacts that do not match the ID passed', done => {
				this.book
					.addContact(
						'Rick Deckard',
						'000-000-0000',
						'null@null.com',
						'unemployed'
					)
					.then(() => {
						this.book.getContacts().then(contacts => {
							expect(contacts[0].name).toBe('Rick Deckard');
							expect(contacts.length).toBe(1);
							this.book.delete(99).then(() => {
								this.book
									.getContacts()
									.then(contacts => {
										expect(contacts.length).toBe(1);
										done();
									})
									.catch(err => {
										console.log(err);
										done();
									});
							});
						});
					});
			});
			it('should remove the contact that matches the ID passed', done => {
				this.book
					.addContact(
						'Rick Deckard',
						'000-000-0000',
						'null@null.com',
						'unemployed'
					)
					.then(contacts => {
						expect(contacts[0].name).toBe('Rick Deckard');
						expect(contacts.length).toBe(1);
						this.book.delete(contact.id).then(() => {
							this.book
								.getContacts()
								.then(() => {
									expect(contacts.length).toBe(0);
									done();
								})
								.catch(err => {
									console.log(err);
									done();
								});
						});
					});
			});
		});

		// Check for Contact Controller

		describe('ContactController', () => {
			it('should be defined', () => {
				expect(ContactController).toBeDefined();
			});
		});
	});
});
