var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId
    ,timestamps = require('mongoose-timestamp')
    ,MongooseRattle = require('mongoose-rattle-plugin')
             

var PhotoSchema = new Schema({                      
                name: String,                
                _team: {type: Schema.Types.ObjectId, ref: 'Team' }, 
                _player: {type: Schema.Types.ObjectId, ref: 'Player' },
                _user: {type: Schema.Types.ObjectId, ref: 'User' },
                url:String
})

PhotoSchema.plugin(timestamps,MongooseRattle)

PhotoSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id === 'object'? id: new ObjectId(id)
        })
    }
}


mongoose.model('Photo', PhotoSchema, 'photos', true);