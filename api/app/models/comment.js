var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')


var CommentSchema = new Schema({      
                _user: {type: Schema.Types.ObjectId, ref: 'User' },
                _feed: {type: Schema.Types.ObjectId, ref: 'Feed' },
                _player: {type: Schema.Types.ObjectId, ref: 'Player' },
                _team: {type: Schema.Types.ObjectId, ref: 'Team' },
                title: String,
                message: String,
                username: {type:String, default:'Anonymous'}
})

CommentSchema.plugin(timestamps,MongooseRattle)

CommentSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        })
    }
};


/**
 * Virtuals
 */
/*
SchemaName.virtual('transientFieldName').set(function(param) {
    
}).get(function() {
    
});
*/

/**
Transforms
*
*/

/*
SchemaName.options.toJSON ={
    transform: function(team, json, options) {
       
    }
}
*/

/**
 * Validations
 */

/*
SchemaName.path('field').validate(function(field) {
   
    return true;    
}, 'Error validation message');
*/

/**
 * Pre-save hook
 */

/*
 */

/*SchemaName.pre('save', function(next) {
    
});
*/

/*CommentSchema.post('validate', function (doc) {
   console.log('Post validate' + doc._user)
  doc.username = doc._user.name
})*/

/**
 * Methods
 */

/*
SchemaName.methods = {
                
}
*/


mongoose.model('Comment', CommentSchema, 'comments', true);