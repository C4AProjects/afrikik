#!/usr/bin/env node
var async = require('async')

async.series(
    [
        function(cb){
            setTimeout(function(){console.log('1st function'); cb(null,1)},1000)
            
        },
        function( cb){            
            console.log('2nd function')
            cb(null,2)
        }
    ]
)