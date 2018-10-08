const express = require('express');
const cors = require('cors');
const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

var uploadFolder = 'uploaded files/';

const server = express();

server.use(cors(corsOptions));

server.use(function(req, res, next) {
  req.headers['if-none-match'] = 'no-match-for-this';
  next();
});

server.post('/fileUpload', function(req, res) {
    console.log('Uploaded file received.');
    var form = new IncomingForm();
    form.parse(req, function(err, field, file) {
        if (err) {
            console.log('error : ' + err);
            var ret = {
                error : err
            };
            res.json(ret);
            res.end();
            return;
        }
        var oldpath = file.file.path;
        var newpath = uploadFolder + file.file.name;
        fs.exists(newpath, function(exists) {
            if (exists) {
                console.log('File already exists');
                var ret = {
                    error : 'File already exists.'
                };
                res.json(ret);
                res.end();
                return;
            }
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                console.log('File saved');
                res.end();
            });
      });
    });
});

server.get('/fileList', function(req, res) {
    console.log('File list request received.');
    var files = fs.readdirSync(uploadFolder);
    files.sort(function(a, b) {
      return fs.statSync(uploadFolder + b).mtime.getTime() -
        fs.statSync(uploadFolder + a).mtime.getTime();
    });
    res.json(files);
    res.end();
});

server.get('/fileDownload', function(req, res) {
  console.log('File download request received.');
  var filePath = uploadFolder + req.query.fileName;
  fs.exists(filePath, function(exists) {
    if (!exists) {
      console.log('Unknown file');
      var ret = {
        error : 'Unknown file.'
      };
      res.json(ret);
      res.end();
      return;
    }
    var options = {
      root: __dirname + '/../',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };
    res.sendFile(uploadFolder + req.query.fileName, options, function (err) {
      if (err) {
        throw err;
      } else {
        console.log('File sent : ' + uploadFolder + req.query.fileName);
      }
    });
  })
});

server.delete('/fileDelete', function(req, res) {
  console.log('File delete request received.');
  var filePath = uploadFolder + req.query.fileName;
  fs.exists(filePath, function(exists) {
    if (!exists) {
      console.log('No file to delete');
      res.json('No file to delete.');
      res.end();
      return;
    }
    fs.unlink(filePath, function (err) {
      if (err) throw err;
      console.log('File deleted');
      res.json('File deleted.');
      res.end();
    });
  })
});

server.listen(8000, function() {
    console.log('Server started!');
});
