const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteGenres: [String],
});

userSchema.pre('save', async function (next){
    if (!this.isModified('password')) return next();
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;