var mongoose = require('mongoose');
var fs = require('fs')


exports.writeFile = function(file, options){
  
  /*options ={
    filename: 'field.txt',
    chunkSize: 1024, 
    content_type: 'plain/text',
    mode:'w',
    root: 'photos'
  }*/

  var writestream = this.gfs.createWriteStream(options);
  fs.createReadStream(file).pipe(writestream);
  
  writestream.on('close', function (file) {
    console.log(file.filename);
    process.exit(0)
  });
}

exports.readFile = function(options){
  var readstream = this.gfs.createReadStream(options);
  readstream.pipe(response);
}

exports.removeFile = function(options){
  this.gfs.remove(options, function (err) {    
    console.log('success');
  });
}

exports.metadata = function(fileName, root){
  this.gfs.collection(root||'photos').files.find({ filename: fileName }).toArray(function (err, files) {    
    console.log(files);
  })
}