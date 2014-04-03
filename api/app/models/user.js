/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('underscore'),
    authTypes = ['github', 'twitter', 'facebook', 'google'];


/**
 * User Schema
 */
var UserSchema = new Schema({
    email: { type: String, required: true },
    username:  { type: String, required: true, unique:true },
    provider: String,
    posts : [{ type: Schema.ObjectId, ref: 'Post' }],
    postrequests : [{ type: Schema.ObjectId, ref: 'PostRequest' }],
	favorites : [{ type: Schema.ObjectId, ref: 'Post' }],
    hashed_password:  { type: String, select: false },
    salt:  { type: String, select: false },
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    slug:{type: String, required: false},
    created: {type: Date, default: Date.now},
    modified:{type: Date, default: Date.now},
    
    _profile: {type: Schema.Types.ObjectId, ref: 'UserProfile'},
    subscribedPlayers: [{type: Schema.ObjectId, ref: 'Player'}],
    subscribedTeams: [{type: Schema.ObjectId, ref: 'Team'}],
    followers: [{type: Schema.ObjectId, ref: 'User'}], //_id members that follow member
    following: [{type: Schema.ObjectId, ref: 'User'}],
    feeds: [{type: Schema.ObjectId, ref: 'Feed'}],
    requests: [{type: Schema.ObjectId, ref: 'User'}], // friend requests user have to accept    
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    console.log("Salt was created %s", this.salt)
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
Transforms
*
*/
UserSchema.options.toJSON ={
    transform: function(user, json, options) {
        delete json.hashed_password;
        delete json.salt;
       
    }

}

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

UserSchema.path('email').validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User')
  
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) fn(true)

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(err || users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('username').validate(function(username) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password) return '';
        console.log("Password sent in: %s, me; %j", password, this)
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

mongoose.model('User', UserSchema, 'users', true);
