var mongoose = require('mongoose'),
    Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId,
  slug = require('mongoose-slug')
   ;


var PostSchema = new Schema({
		id:{type: Number, required: false},
		user_id:{type: Number, required: false},
		word: {type: String, required: true},
	 	definition:{type: String, required: true},
	 	slug:{type: String, required: false},
	 	example:{type: String, required: true},
	 	page_views:{type: Number, required: false},
	 	props:{type: Number, required: false},
	 	referrer:{type: String, required: false},
	 	is_from_request:{type: Boolean, required: false},
	 	created: {type: Date, default: Date.now},
	 	modified:{type: Date, default: Date.now},
	    creator : { type: ObjectId, ref: 'User' },
	    tags : [{ type: ObjectId, ref: 'Tag' }],
	    likes : [{ type: ObjectId, ref: 'User' }]
});

PostSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('creator').exec(cb);
    }
};

PostSchema.plugin(slug('word'));

module.exports=mongoose.model('Post', PostSchema, 'posts', true);