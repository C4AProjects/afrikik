var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')


var CommentSchema = new Schema({      
                _user: {type: Schema.Types.ObjectId, ref: 'User' },
                _feed: {type: Schema.Types.ObjectId, ref: 'Feed' },
                title: String,
                message: String,
})

CommentSchema.plugin(timestamps,MongooseRattle)

CommentSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        })
    }
};

mongoose.model('Comment', CommentSchema, 'comments', true);