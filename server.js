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
    
         var blob = new Buffer(req.body.blob, 'base64'); // decode
           // var blob = req.body.blob;
       
      
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
  var fingerprint_obj = JSON.parse(body);

 if (fingerprint_obj.status.msg == 'No result'){
     resp.json( 
                {    
            track:'No result, please try again',
            artist:'No result, please try again' ,
            first_album:'No result, please try again'
        }
        )
 };

  if (fingerprint_obj.status.msg != 'No result'){

    //grab info from music fingerprinting API
    //TODO: handle multiple responses
  var artist = fingerprint_obj.metadata.music[0].artists[0].name;
  var track = fingerprint_obj.metadata.music[0].title;
  var album = fingerprint_obj.metadata.music[0].album.name; 

  //once we have the track, we need to go grab info from discogs
  //http://www.onemusicapi.com/blog/2013/06/12/better-discogs-searching/
    var apiKey = 'NkGkQmxCMALmQCBYYdnZ';
    var apiSecret = 'npMAgZwCuvfselUUpysRCqyXdQUrqcZh';
    var artist_str = artist.replace(/[^\w\s]|_/g, "+").replace(/\s+/g, "+"); 
    var album_str = album.replace(/[^\w\s]|_/g, "+").replace(/\s+/g, "+");
    var track_str = track.replace(/[^\w\s]|_/g, "+").replace(/\s+/g, "+");
    var discogs_query = 'artist='+ artist_str + '&q=' + 'track:' + track_str + '&format=vinyl' + '&key=' + apiKey + '&secret=' + apiSecret;
    //console.log('artist: ' + artist + ' album: ' + album);
    console.log('query' + discogs_query);
    var options = {
        host :  'api.discogs.com',
        headers: { 
            'User-Agent' : 'Megastream/0.1'
        },
        path : '/database/search?' + discogs_query,
        method : 'GET'
    }
    //making the https get call 
    var getReq = https.request(options, function(response) {
        var dcBody = '';
        response.on('data', function(d) {
            dcBody += d;
        });
        response.on('end', function() {
            // Data reception is done, do whatever with it
            var discogs_obj = JSON.parse(dcBody);
             //now respond to the client with the fingerprinting and discogs data
             //console.log('discogs response:'+dcBody);
             if(discogs_obj.results){
                resp.json( 
                {    
                    discogs_obj:discogs_obj,
                    fingerprint_obj:fingerprint_obj,
                    release_results:discogs_obj.results,
                    first_image:discogs_obj.results[0].thumb,
                    first_album:discogs_obj.results[0].title,
                    track:track,
                    artist:artist,
                    show_discogs_results:true 
                  
                }
            );
            };
             if(!discogs_obj.results){
                resp.json( 
                {    

                    track:track,
                    artist:artist,
                    first_album:album,
                    show_discogs_results:false  
                  
                }
            );
            };

        });
    });

    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
        return  resp.status(500).send({error: 'server error occurred'})
    });


    }
        });
    }, 1000);



});

    //get a request token from Discogs
    //TODO: persist requestData to user account instead of filesystem (for testing only)
   router.get('/authorize', function(req, res){
 //interact with Discogs
  var Discogs = require('disconnect').Client;
    var oAuth = new Discogs().oauth();
    oAuth.getRequestToken(
        'NkGkQmxCMALmQCBYYdnZ', 
        'npMAgZwCuvfselUUpysRCqyXdQUrqcZh', 
        'http://localhost:8080/#/', 
        function(err, requestData){
            // Persist "requestData" here so that the callback handler can 
            // access it later after returning from the authorize url
            var discogsdata = require('node-persist');
            discogsdata.initSync();
            discogsdata.setItem('requestData',requestData);
            res.json(
                {
                    url:requestData.authorizeUrl
                }
                
                 );
        }
    );
});

   //get an access token from Discogs
   //TODO: persist accessData to user account instead of filesystem (for testing only)
   router.get('/callback', function(req, res){
    var Discogs = require('disconnect').Client;
    var discogsdata = require('node-persist');
    var oAuth = new Discogs(discogsdata.getItem('requestData')).oauth();
    oAuth.getAccessToken(
        req.query.oauth_verifier, // Verification code sent back by Discogs
        function(err, accessData){
            // Persist "accessData" here for following OAuth calls 
            discogsdata.initSync();
            discogsdata.setItem('accessData',accessData);
            res.send('Received access token!');
        }
    );
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
  
    app.listen(8080);
    console.log("App listening on port 8080");

  
