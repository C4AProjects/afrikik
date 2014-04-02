var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')


var FeedSchema = new Schema({      
                url: String, // external url 
                message: String,
                photo: String,
                _user: {type: Schema.Types.ObjectId, ref: 'User' }, // if public feed
                _team: {type: Schema.Types.ObjectId, ref: 'Team' },  // if team feed
                _player: {type: Schema.Types.ObjectId, ref: 'Player' }, // if player feed
                comments: [{type: Schema.Types.ObjectId, ref: 'Comment' }], 
                tags: [{type: String}]

})

FeedSchema.plugin(timestamps,MongooseRattle)

FeedSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id === 'object'? id: new ObjectId(id)
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

/**
 * Methods
 */

/*
SchemaName.methods = {
                
}
*/


mongoose.model('Feed', FeedSchema, 'feeds', true);