/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    _ = require('underscore');


/**
 * Find post by id
 */
exports.post = function(req, res, next, id) {

    Post.load(id, function(err, post) {
        if (err) return next(err);
        if (!post) return next(new Error('Failed to load post ' + id));
        req.post = post;

        next();
    });
};




/**
 * Create a post
 */
exports.create = function(req, res) {
    var post = new Post(req.body);

    post.creator = req.user;
    post.save();
    res.json(post);
};

/**
 * Update a post
 */
exports.update = function(req, res) {
    var post = req.post;

    post = _.extend(post, req.body);

    post.save(function(err) {
        res.json(post);
    });
};

/**
 * Delete an post
 */
exports.destroy = function(req, res) {
    var post = req.post;

    post.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.json(post);
        }
    });
};

/**
 * Show a post
 */
exports.show = function(req, res) {
    Post.populate(req.post,[ 
        {
            path:"creator",
        },
        {
            path:"tags",
        }
    ],function (err, post) {
            res.json(req.post);
        }
    )
   
   
};

/**
 * List of Posts
 */
exports.all = function(req, res) {
    //limit=10&populate=creator&skip=0&sort=-created)
    var limit = req.query.limit,
        populate=req.query.populate,
        skip=req.query.skip,
        sort=req.query.sort;
        Post.find().limit(limit).sort(sort).populate(populate).skip(skip).exec(function(err, posts) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.json(posts);
        }
    });
};