const { Schema, model } = require('mongoose');

const CutieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    'owned-by': {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    picture: [String],
    reckoning: {
        comments: String,
        residency: Boolean,
        graded: [
            { trait: String, grade: Number }, //appearence
            { trait: String, grade: Number }, //sex
            { trait: String, grade: Number }, //structure
            { trait: String, grade: Number } //niceness
        ]
    },
    'social-networks': {
        instagram: String,
        facebook: String,
        snapchat: String,
        tel: String,
        twitter: String,
        linkedin: String,
        'email-address': String,
        tinder: String,
        happn: String,
        bumble: String,
        'inner-circle': String
    }

},
    {
        timestamps: true
    }
);

module.exports = model('Cutie', CutieSchema);
