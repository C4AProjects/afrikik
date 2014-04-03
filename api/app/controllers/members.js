/**
 * Module dependencies.
 */
var mongoose = require('mongoose')
    , _ = require('underscore')
    , User = mongoose.model('User')
    , utils = require('../lib/utils')
    , logger = require('winston')
    , UserProfile = mongoose.model('UserProfile')
    , ObjectId = mongoose.Types.ObjectId;


/************************************************************************************
 *          User/member searching by name/fullName : /users/search/Abou
 **************************************************************************************/

exports.searchByName = function(req, res){
    var regex = new RegExp(req.params.name, 'i');
    UserProfile.find({fullName:regex})    
    .limit(req.params.limit||10)
    .populate('_user')
    .exec(function(err, list){
       if(err) res.status(401).json({err: err})
       if (list) {
        res.status(200).json(list)
       }
    })
}


/************************************************************************************
 *    <POST>  Member subscribes to player : /users/USER_ID/subscribe/players/PLAYER_ID
 **************************************************************************************/

exports.subscribeToPlayer = function(req, res){
    var user = req.user
    if(user.subscribedPlayers.indexOf(req.params.playerId)<0){
        user.subscribedPlayers.push(req.params.playerId)
        user.save(function(err, user){
           if(err) res.status(401).json({err: err})
           res.status(200).json(user)
        })
    }
}

/************************************************************************************
 *    <POST>  Member subscribes to team : /users/USER_ID/subscribe/teams/TEAM_ID
 **************************************************************************************/

exports.subscribeToTeam = function(req, res){
    var user = req.user
    if(user.subscribedTeams.indexOf(req.params.teamId)<0){
        user.subscribedTeams.push(req.params.teamId)
        user.save(function(err, user){
           if(err) res.status(401).json({err: err})
           res.status(200).json(user)
        })
    }
}

/************************************************************************************
 *          Get friends requests : /users/USER_ID/followers/requests
 **************************************************************************************/

exports.getFriendRequests = function(req, res){
    User.findOne({_id: req.user._id})    
    .populate('requests')
    .exec(function(err, user){
        if(err) res.status(401).json({err: err})        
        res.status(200).json(user.requests)
    })
}

/************************************************************************************
 *    Get all subscribed members to a player : /users/USER_ID/players/PLAYER_ID/friends
 **************************************************************************************/

exports.getUsersPlayer = function(req, res){
    User.find({subscribedPlayers: req.player._id})       
    .exec(function(err, list){
        if(err) res.status(401).json({err: err})        
        res.status(200).json({count: list.count(), items:list})
    })
}

/************************************************************************************
 *    Get all subscribed members to a team : /users/USER_ID/teams/TEAM_ID/friends
 **************************************************************************************/

exports.getUsersTeam = function(req, res){
    User.find({subscribedTeams: req.team._id})        
    .exec(function(err, list){
        if(err) res.status(401).json({err: err})        
        res.status(200).json({count: list.count(), items:list})
    })
}

/************************************************************************************
 *    <POST> Approve friend request : /users/USER_ID/approve
 **************************************************************************************/

exports.approveFriendRequest = function(req, res){
    var user = req.user
    if (req.body.approveAll||req.params.approveAll) {
        user.requests.forEach(function(item){
            user.followers.addToSet(item)
        })
        users.requests=[] // empty requests field        
    }
    else
    {   var userId = req.body.friendId
        user.followers.addToSet(userId)
        user.requests.pop(userId)
    }
    user.save(function(err, user){
        if(err) res.status(401).json({err: err})        
        res.status(200).json(user)
    })
}

/************************************************************************************
 *    <POST> Deny friend request : /users/USER_ID/deny
 **************************************************************************************/

exports.denyFriendRequest = function(req, res){
    var user = req.user
    if (req.body.denyAll||req.params.denyAll) {        
        users.requests=[] // empty requests field        
    }
    else
    {   var userId = req.body.friendId        
        user.requests.remove(userId)
    }
    user.save(function(err, user){
        if(err) res.status(401).json({err: err})        
        res.status(200).json(user)
    })
}

/************************************************************************************
 *    <POST> Unfollow friend : /users/USER_ID/unfollow
 **************************************************************************************/

exports.unfollowFriend = function(req, res){
    var user = req.user
    var userId = req.body.friendId        
        user.following(userId)        
    user.save(function(err, user){
        if(err) res.status(401).json({err: err})        
        res.status(200).json(user)
    })
}

