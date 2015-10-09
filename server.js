// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    

    // configuration =================

    //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
     var bodyParser = require('body-parser');
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    var https = require('https');
   
    app.use(methodOverride());

    // listen (start app with node server.js) ======================================

     //routes
     var router = express.Router(); 
      //upload audio track
    router.post('/uploadtrack', function(req, resp){
    
        // var blob = new Buffer(req.body.blob, 'base64'); // decode
            var blob = req.body.blob;
       
      
        if (!blob)
        {
            return resp.status(500).send({error: 'bad parameters'})
        }
     

        var file = require("fs").writeFile("test.wav", blob, 'base64', function(err) {
            console.log(err);
             
                });

       
      

        //ACR CLOUD WEB API 
 
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
//npm install request
var request = require('request');

var defaultOptions = {
  host: 'ap-southeast-1.api.acrcloud.com',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type:'audio',
  secure: true,
  access_key: '78ba6e7957b42de6865dd5fc6d0eaf07',
  access_secret: 'BYDVdABWWJJ90qxiYi3c8NKgbTzd42etfWSbEgHd',
  audio_format:'wav',
  sample_rate:'44100',
  audio_channels: '2'

};

function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}

function sign(signString, accessSecret) {
  return crypto.createHmac('sha1', accessSecret)
    .update(new Buffer(signString, 'utf-8'))
    .digest().toString('base64');
}

/**
 * Identifies a sample of bytes
 */
function identify(data, options, cb) {

  var current_data = new Date();
  var timestamp = current_data.getTime()/1000;

  var stringToSign = buildStringToSign('POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp);

  var signature = sign(stringToSign, options.access_secret);

  var formData = {
    sample: data,
    access_key:options.access_key,
    data_type:options.data_type,
    signature_version:options.signature_version,
    signature:signature,
    sample_bytes:data.length,
    timestamp:timestamp,
  }
  request.post({
    url: "http://"+options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb);
}

//need to wait for the file to be created before we post to ACRCloud
setTimeout(function() {
    var bitmap = fs.readFileSync(__dirname + '/test.wav');
  identify(new Buffer(bitmap), defaultOptions, function (err, httpResponse, body) {
  if (err) console.log(err);
  console.log(body);
  var obj = JSON.parse(body);
  var artist = obj.metadata.music[0].artists[0].name;
  var title = obj.metadata.music[0].title;
  var album = obj.metadata.music[0].album.name;

  resp.json(
                {   
                    test:obj,
                    album:album,
                    title:title,
                    artist:artist  
                }
            );
});
}, 1000);



});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
  
    app.listen(8080);
    console.log("App listening on port 8080");

  
