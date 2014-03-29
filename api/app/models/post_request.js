var mongoose = require('mongoose'),
    slug = require('mongoose-slug'),
    Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId
   ;


var PostRequestSchema = new Schema({	 	
 	active:{type: Boolean, required: false, default:true},
 	word: {type: String, required: true},
 	type: {type: String, enum: ['no-fr', 'fr-no'], default:'no-fr'},
 	resolver: { type: Schema.Types.ObjectId, ref: 'User'},
 	requester: { type: Schema.Types.ObjectId, ref: 'User'},
 	post: { type: Schema.Types.ObjectId, ref: 'Post'},
 	requester_email:{type: String, required: false},
 	slug:{type: String, required: false},
 	created: {type: Date, default: Date.now},
 	modified:{type: Date, default: Date.now},
 	id:{type: Number, required: false},
	resolver_id:{type: Number, required: false},
	requester_id:{type: Number, required: false},
	post_id:{type: Number, required: false},	

});

PostRequestSchema.plugin(slug('word'));

PostRequestSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('requester resolver').exec(cb);
    }
};
module.exports=mongoose.model('PostRequest', PostRequestSchema, 'post_requests',true);