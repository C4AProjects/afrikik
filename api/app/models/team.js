var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')


var TeamSchema = new Schema({      
                name: String,
                description: String,
                location: String,
                foundedDate: Date,
                coachName: String,                
                profile: {wins: Number, loss: Number, draw: Number},
                picture: {type:String, default:'nopic-team.png'},
                rating: {type:Number},
                _photo: {type: Schema.Types.ObjectId, ref: 'Photo' },
                comments: [{type: Schema.Types.ObjectId, ref: 'Comment' }]
                , img_url: {type:String, required:false}
                , nationalTeam: Boolean
})


TeamSchema.plugin(timestamps,MongooseRattle)

TeamSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id 
        })
    }
};

TeamSchema.virtual('isTeam').get(function () {
  return true;
});

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


mongoose.model('Team',  TeamSchema, 'teams', true);