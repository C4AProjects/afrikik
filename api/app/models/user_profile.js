var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')


var UserProfileSchema = new Schema({      
      fullName: String,
      dob: Date,
      country: String,
      _user: {type: Schema.Types.ObjectId, ref: 'User' },
      _photo: {type: Schema.Types.ObjectId, ref: 'Photo' }
})

UserProfileSchema.plugin(timestamps,MongooseRattle)

UserProfileSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        })
    }
};

mongoose.model('UserProfile', UserProfileSchema, 'user_profiles', true);