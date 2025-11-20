// backend/src/services/auth.service.js
const bcrypt = require('bcrypt');
const {User} = require('../database/models');

const SALT_ROUNDS = 10;

async function register({full_name, email, password, phone}) {
    const existed = await User.findOne({where: {
            email
        }});
    if (existed) {
        const err = new Error('Email đã tồn tại');
        err.statusCode = 400;
        throw err;
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        full_name,
        email,
        password_hash,
        phone,
        role: 'VOLUNTEER'
    });

    return user;
}

async function validateUser(email, password) {
    const user = await User.findOne({where: {
            email
        }});
    if (! user) 
        return null;
    

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (! isMatch) 
        return null;
    

    return user;
}

module.exports = {
    register,
    validateUser
};
