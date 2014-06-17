var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')
             

var StatSchema = new Schema({                      
                league : String,
                sub : String,
                season : String,
                minutes : String,
                redc : String,
                games : String,
                goals : String,
                team : String,
                yellowc : String,
                _player : {type: Schema.Types.ObjectId, ref: 'Player' }

})

StatSchema.plugin(timestamps,MongooseRattle)

StatSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id === 'object'? id: new ObjectId(id)
        })
    }
}


mongoose.model('PlayerStat', StatSchema, 'playerstats', true);