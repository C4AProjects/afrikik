/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    PostRequest = mongoose.model('PostRequest'),
    Post = mongoose.model('Post'),
    _ = require('underscore');


/**
 * Find post by id
 */
exports.postRequest = function(req, res, next, id) {
    var PostRequest = mongoose.model('PostRequest');
    PostRequest.load(id, function(err, postRequest) {
        if (err) return next(err);
        if (!postRequest) return next(new Error('Failed to load post ' + id));
        req.postRequest = postRequest;

        next();
    });
};


/**
 * Create a post request
 */
exports.create = function(req, res) {
    var postRequest = new PostRequest(req.body);

    postRequest.requester = req.user;
    postRequest.save(function(err, postRequest){
        if(err)
        {
            console.dir(err)
            res.status(400).json({error:err})
        }
        res.json(postRequest);

    });
    
};

/**
 * Update a post request
 */
exports.update = function(req, res) {
    var postRequest = req.postRequest;

    postRequest = _.extend(postRequest, req.body);

    postRequest.save(function(err) {
        if(err)
        {
            res.status(400).json({error:err})
        }
        res.json(postRequest);
    });
};

/**
 * Delete a post request
 */
exports.destroy = function(req, res) {
    var postRequest = req.postRequest;

    postRequest.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.json(postRequest);
        }
    });
};


/**
 * Resolve a post request
 */
exports.resolve = function(req, res) {
    res.json(req.postRequest);
};

/**
 * Show a post request
 */
exports.show = function(req, res) {
    res.json(req.postRequest);
};

/**
 * List of Post Requests
 */
exports.all = function(req, res) {
    //limit=10&populate=creator&skip=0&sort=-created)
    var limit = req.query.limit || 10,
        populate=req.query.populate || 'requester resolver',
        skip=req.query.skip || 0,
        sort=req.query.sort|| 'asc';
    PostRequest.find({active:true}).limit(limit).sort(sort).populate(populate).skip(skip).exec(function(err, postRequests) {
        if (err) {
            res.status(500).json({error:err})
        } else {
            res.json(postRequests);
        }
    });
};