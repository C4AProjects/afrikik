var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')


var MatchSchema = new Schema({
                _team1: {type: Schema.Types.ObjectId, ref: 'Team' },
                _team2: {type: Schema.Types.ObjectId, ref: 'Team' }, // Opponent team
                playersTeam1: [{type: Schema.Types.ObjectId, ref: 'Player' }],
                playersTeam2: [{type: Schema.Types.ObjectId, ref: 'Player' }],
                referees: [{type: String }],
                cards: { red: Number, yellow: Number}, // or cards: [ redCardNumber, YellowCardNumber]                
                goals: [],
                dateMatch: Date,
                competition: String, // Africa cup, friendly, league, qualifications, etc.
                details: String,
                comments: [{type: Schema.Types.ObjectId, ref: 'Comment' }]
                ,summary_video: String //youtube or dailymotion_video url of the match
                ,score: String // 2:1
                ,scoreTeam1: Number
                ,scoreTeam2: Number
})

MatchSchema.plugin(timestamps,MongooseRattle)

MatchSchema.statics = {
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


mongoose.model('Match', MatchSchema, 'matches', true);