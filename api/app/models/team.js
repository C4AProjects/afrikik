var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')


var TeamSchema = new Schema({      
                name: String,
                foundedDate: Date,
                coachName: String,                
                profile: {wins: Number, loss: Number, draw: Number},  
                ratings: [{type:Number}]
})

TeamSchema.plugin(timestamps,MongooseRattle)

TeamSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id === 'object'? id: new ObjectId(id)
        })
    }
};

mongoose.model('Team',  TeamSchema, 'teams', true);