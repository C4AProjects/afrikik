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
                team: String, // make reference to international team
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

mongoose.model('Player', PlayerSchema, 'players', true);