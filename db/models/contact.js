'use strict';
module.exports = (sequelize, DataTypes) => {
	var Contact = sequelize.define(
		'Contact',
		{
			name: DataTypes.STRING,
			phone: DataTypes.STRING,
			email: DataTypes.STRING,
			company: DataTypes.STRING
		},
		{}
	);
	Contact.associate = function(models) {
		// associations can be defined here
	};
	return Contact;
};
