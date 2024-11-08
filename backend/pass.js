const bcrypt = require('bcryptjs');

const password = 'Gopi@123';
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log(hashedPassword); // This is the password you'll insert into MongoDB
