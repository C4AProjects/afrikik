var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')

var TrophySchema = new Schema({
                africaCup: Number,
                worldCup: Number                
})                

var PlayerSchema = new Schema({                      
                fullName: String,
                dob: Date,
                nationality: String, // the value may be from country collections
                club: String,
                _team: {type: Schema.Types.ObjectId, ref: 'Team' }, // make reference to international team
                height: Number, 
                weight: Number,
                picture: String, // url of player picture
                position: String, // the differents existing positions may be controlled by the API
                matchs: [{type: Schema.ObjectId, ref: 'Match'}],  // set of _id match participated
                ratings: [{type: Number}],
                trophy: [TrophySchema]                
})

PlayerSchema.plugin(timestamps,MongooseRattle)

PlayerSchema.statics = {
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


PlayerSchema.methods = {
    sanitize : function(text) {                
           return text.replace(/\[-\[\]{\}\(\)\*+?.,\^$|#s\]/, "\$&");
    
    }           
}


mongoose.model('Player', PlayerSchema, 'players', true);