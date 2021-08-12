const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const user = new mongoose.Schema({
    first_name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
        validate:{
            validator: validator.isEmail,
            message: 'Email is not a valid email',
            isAsync: false
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Google', 'Facebook']
    }
});

user.pre(
    'save',
    async function(next) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    }
); 

user.methods.isValidPassword = async function(password, userPassword) {
    const compare = await bcrypt.compare(password, userPassword);  
    return compare;
};

const UserSchema = mongoose.model('users', user);

module.exports = UserSchema;