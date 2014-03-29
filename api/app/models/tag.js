var mongoose = require('mongoose'),
    Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId
   ;


var TagSchema = new Schema({
		id:{type: String, required: false},
		identifier:{type: String, required: false},
		weight:{type: Number, required: false},
		name: {type: String, required: true},
	 	keyname:{type: String, required: true},
	 	created: {type: Date, default: Date.now},
	 	modified:{type: Date, default: Date.now},
	 	post: { type: Schema.Types.ObjectId, ref: 'Post' }


});

module.exports=mongoose.model('Tag', TagSchema, 'tags', true);