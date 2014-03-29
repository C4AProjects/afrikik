/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * ConfirmCode Schema
 */
var ConfirmCodeSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    code: String
});


mongoose.model('ConfirmCode', ConfirmCodeSchema,'confirmcodes', true);
