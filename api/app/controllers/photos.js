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
  , async = require('async')
  

exports.uploadAsFileSystem = function(req, res){
  var image = req.files.image
  //console.log('path image :' + __dirname.substr(0,__dirname.indexOf('app')) + "uploads/"+image.name)  
  is = fs.createReadStream(image.path);
  os = fs.createWriteStream(__dirname.substr(0,__dirname.indexOf('app')) + "public/uploads/"+(req.body.name||image.name));
  is.pipe(os);
  is.on('end', function(){
    fs.unlink(image.path)
    res.json({message:'Photo uploaded!'})
  })  
}

exports.upload = function(req, res){
  var image = req.files.image
  console.log('path image :' + __dirname.substr(0,__dirname.indexOf('app')) + "uploads/"+image.name)
  var photo = new Photo(req.body)
  photo.data = fs.readFileSync(image.path)
  photo.type = image.type;
  photo.name = image.name;
  if (req.team) {
      photo._team = req.team
  }else if (req.player) {
      photo._player = req.player
  }else if (req.user||req.profile) {
      photo._user = req.user||req.profile
  }
  photo.save(function(err, photo){
    if (err) {
      res.status(401).json({err:err})
    }
    if (req.team) {
      team = req.team
      team._photo = photo
      team.save()
    }else if (req.player) {
      player = req.player
      player._photo = photo
      player.save()
    }else if (req.user||req.profile) {
      user = req.user||req.profile
      user.profile._photo = photo
      user.save()
    }
    res.json({message: 'Photo saved'})
    
  })
}

exports.download = function(req, res){      
  photo = req.photo
  res.contentType(photo.type);
  res.end(photo.data, "binary");
}

/**
 * Create a new photo for a member
 *      /users/USER_ID/photos
 */
exports.create = function(req, res) {
    var user = req.user||req.profile,
        file = req.files.file
        
    //Save photo as file system    
    /*
    fs.rename(file.path, __dirname + "/uploads/"+file.name, function(){
	console.log('renamed record');
    })
    */
    
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
