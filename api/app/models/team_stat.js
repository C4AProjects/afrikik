var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')
             

var TeamStatSchema = new Schema({                      
                achievements: {
                                bronze:Array,
                                silver:Array,
                                gold:Array,
                                },
                nickname:[],
                wcappearances: [],
                _team : {type: Schema.Types.ObjectId, ref: 'Team' }

})

TeamStatSchema.plugin(timestamps,MongooseRattle)

TeamStatSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id === 'object'? id: new ObjectId(id)
        })
    }
}


mongoose.model('TeamStat', TeamStatSchema, 'teamstats', true);