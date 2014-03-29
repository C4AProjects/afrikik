/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env],
    Schema = mongoose.Schema;

/**
 * AccessToken Schema
 */
var RefreshTokenSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    token: String,
    user: {
        type: Schema.ObjectId,
        ref: 'User' 
    },
    client: {
        type: Schema.ObjectId,
        ref: 'OAuthClient'
    }
});

/**
 * Statics
 */
RefreshTokenSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

mongoose.model('RefreshToken', RefreshTokenSchema,'refreshtokens', true);
