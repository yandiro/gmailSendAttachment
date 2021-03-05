const { Schema, model } = require('mongoose');

const SentEmailSchema = new Schema({
    submission_id: {
        type: String,
        required: true
    },
    email_to: {
        type: String,
        required: true
    },
    email_from: {
        type: String,
        required: true
    },
    file_name: {
        type: String,
        // required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = model('SentEmail', SentEmailSchema);
