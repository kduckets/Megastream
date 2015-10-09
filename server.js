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
   
    app.use(methodOverride());

    // listen (start app with node server.js) ======================================

    //routes
      //upload audio track
    app.post('/api/uploadtrack', function(req, resp){
    
      
        console.log('body='+ req.body.blob);
        var body = new Buffer(req.body.blob, 'base64'); // decode

       
      
        if (!body)
        {
            return resp.status(500).send({error: 'bad parameters'})
        }
    

        //initialize options values, the value of the method can be changed to POST to make https post calls
        var apiKey = 'LFJOHTELG1WX5SPLW';
        var options = {
            host :  'developer.echonest.com',
            port : 443,
            path : '/api/v4/track/upload?api_key=' + apiKey + '&filetype=wav&track=' + body,
            method : 'POST'
        }

            //TODO call the echonest API
    });

  
    app.listen(8080);
    console.log("App listening on port 8080");

  
