const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cuties: [{ type: Schema.Types.ObjectId, ref: 'Cutie' }]
});

module.exports = model('User', UserSchema);