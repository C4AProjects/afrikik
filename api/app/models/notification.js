var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')


var NotificationSchema = new Schema({                     
                users: [{type: Schema.Types.ObjectId, ref: 'User' }], // user to notify
                _feed: {type: Schema.Types.ObjectId, ref: 'Feed' }  // if feed related                
})

NotificationSchema.plugin(timestamps,MongooseRattle)

NotificationSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id === 'object'? id: new ObjectId(id)
        })
    }
};

mongoose.model('Notification', NotificationSchema, 'notifications', true);