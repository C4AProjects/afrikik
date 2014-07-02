/**
 * This controller is for the Stat object of the API
 */

var mongoose = require('mongoose')
  , _ = require('underscore')
  , Stat = mongoose.model('PlayerStat')
  , ObjectId = mongoose.Types.ObjectId
  , logger = require('winston')
  
/************************************************************************************
 *         list all stats
 **************************************************************************************/

exports.stats = function(req, res) {
    Stat.find({})
        .populate('_player')
        .sort({season:-1})
        .skip(req.query.skip||0)
        .limit(req.query.limit||50)  
        .exec(function(err, list) {
          if (err) {
              res.status(500).json( {
                  success:false,
                  error: err
              });
          } else {
              res.json(list);
          }
    });
   
};

/**
 * Create a new stat
 */
exports.create = function(req, res) {
    var stat = new Stat(req.body)           
    stat.save(function(err, stat) 
    {
      if(err) {
        res.status(500).json( {
            success:false,
            error: err
        });
      }
      res.status(201).json({succes: true, message:'Stat creation succeeded! :' + stat._id})
    })
};


/**
 * Update a stat
 */
exports.update = function(req, res){    
    var stat = req.stat
    stat = _.extend(stat, req.body)
    stat.save(function(err, stat) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        }
        if(stat)
        {
            logger.debug("Stat updated with success")
            res.status(200).json(stat)
        }        
  })
}

/**
 *  Show Stat
 */
exports.show = function(req, res) {    
    Stat.findOne({
            _id: req.params.statId
        })
        .populate('_player')
        .exec(function(err, stat) {
            if (err) {
                res.status(500).json( {
                    success:false,
                    error: err
                });
            } else {
                res.json(stat);
            }
    });
   
};

/**
 *  Remove Stat
 */
exports.destroy = function(req, res) {    
    var stat = req.stat;
    stat.remove(function(err) {
        if (err) {
            res.status(500).json( {
                success:false,
                error: err
            });
        } else {
            res.status(200).json({message: 'Stat succesfully removed !'});
        }
    });
   
};


/**
 * Find stat by id param
 */
exports.stat = function(req, res, next, id) {
    logger.debug('Stat id parameter: %s', id)
    if(id)
    {
        Stat.findOne({
            _id: new ObjectId(id)
        })
        .exec(function(err, stat) {
            if (err){
              res.status(500).json( {
                success:false,
                error: err
              })}
            if (!stat) 
            {
              res.status(401).json({
                    error:"Invalid stat"
                });
            }
            req.stat = stat;
            next();
        });
    }
    else{
        next();
    }
   
};


