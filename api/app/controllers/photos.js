/**
 * This controller is for the Photo object of the API
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Photo = mongoose.model('Photo')
  , logger = require('winston')
  , ObjectId = mongoose.Types.ObjectId
  , fs = require('fs')
  , ObjectId = mongoose.Types.ObjectId
  
  

exports.upload = function(req, res){
  //var file = req.files.file;
  req.gridfs.writeFile('/home/papesdiop/1798616_769919226369656_954325530_n.jpg',{filename: req.query.fileName||req.body.fileName||'afrikik.jpg', root:'pics'})    
}

exports.download = function(req, res){    
  req.gridfs.readFile({_id: new ObjectId(req.params.photoId), root:'pics'}, res)
}

/**
 * Create a new photo for a member
 *      /users/USER_ID/photos
 */
exports.create = function(req, res) {
    var user = req.user||req.profile,
        file = req.files.file
        
    //Save photo as file system    
    fs.rename(file.path, __dirname + "/uploads/"+file.name, function(){
	console.log('renamed record');
    })
    
    //Save photo in mongoDb with gridfs feature    
    req.gridfs.writeFile(file,{filename: req.query.fileName||req.body.fileName||req.body.name||file.name}) 
    
    var photo = new Photo(req.body)    
    photo._user = req.user||req.profile
    photo._player = req.player
    photo._team = req.team
    photo.save(function(err) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      user.profile._photo = photo._id
      user.save(function(err, user){
        if(err) res.status(500).json({error: err})
      })
      res.status(201).json({succes: true, message:'Photo uploaded!'})
    })
};

/**
 *  Show photo
 */
exports.show = function(req, res) {    
   res.status(200).json(req.photo);
};

/**
 *  Get all photos for a user
 *        /users/USER_ID/photos
 */
exports.all = function(req, res) {
    Photo.find({})      
      .limit(req.query.limit||50)  
      .exec(function(err, list) {
          if (err) {
              res.status(500).json( {
                  success:false,
                  error: err
              });
          } else {
              res.status(200).json(list);
          }
    });
   
};

/**
 *  Remove photo
 */
exports.destroy = function(req, res) {    
    var photo = req.photo;
    photo.remove(function(err) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.status(204).json({message: photo._id.toString() + 'succesfully removed !'});
        }
    });
   
};


/**
 * Find photo by id param
 */
exports.photo = function(req, res, next, id) {
    logger.debug('Photo id parameter: %s', id)
    if(id)
    {
        Photo.findOne({
            _id: new ObjectId(id)
        })        
        .exec(function(err, photo) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })
            }
            if (!photo) 
            {
              res.status(401).json({
                    error:"Invalid photo Id"
                });
            }
            req.photo = photo;
            next();
        });
    }
    else{
        next();
    }
   
};
