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
                no: {type:String, default:'-'}, // number player t-shirt
                name: {type:String, required:false},
                img_url: {type:String, required:false},
                description: String,
                dob: {type:Date},
                country: {type:String}, // the value may be from country collections
                club: {type:String, default:'Unknown'},
                clubcountry: {type:String, default:'Unknown'},
                _team: {type: Schema.Types.ObjectId, ref: 'Team' }, // make reference to national team
                height: {type:Number}, 
                weight: {type:Number},
                picture: {type:String, default:'nopic-player.png'}, // url of player picture
                position: {type:String}, // the differents existing positions may be controlled by the API
                matchs: [{type: Schema.ObjectId, ref: 'Match'}],  // set of _id match participated
                rating: {type: Number},
                trophy: [TrophySchema],
                _photo: {type: Schema.Types.ObjectId, ref: 'Photo' },
                comments: [{type: Schema.Types.ObjectId, ref: 'Comment' }]
                ,goals: Number
                ,wins: Number
                ,losses: Number
                ,yellows: Number
                ,reds: Number
})



PlayerSchema.plugin(timestamps,MongooseRattle)

PlayerSchema.statics = {
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
PlayerSchema.path('name').validate(function(name) {
    return name&&name.length;    
}, 'Name player cannot be blank');
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
PlayerSchema.methods = {
    sanitize : function(text) {                
           return text.replace(/\[-\[\]{\}\(\)\*+?.,\^$|#s\]/, "\$&");
    
    }           
}
*/

mongoose.model('Player', PlayerSchema, 'players', true);