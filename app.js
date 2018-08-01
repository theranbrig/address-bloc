const inquirer = require('inquirer');
const menuController = require('./controllers/MenuController');
const menu = new menuController();

menu.clear();
menu.main();
