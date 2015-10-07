'use strict';

app.factory('Audio', function($window, $http) {

    var recordRtcOptions = {
        // 'sample-rate' : 22050
    };

    navigator.getUserMedia = (
        $window.navigator.getUserMedia ||
        $window.navigator.webkitGetUserMedia ||
        $window.navigator.mozGetUserMedia ||
        $window.navigator.msGetUserMedia)

    var _recordRTC = {};
    navigator.getUserMedia({ audio: true, video: false }, function (stream) {
        console.log('starting to initialize getUserMedia');
       

        _recordRTC = RecordRTC(stream);    

        console.log('Finished initializing getUserMedia');
    }, function (error) {
        console.log('Error initializing media stream: ' + error);  
    });

    var Audio = {

    startRecording:function() {
        console.log('starting to record...');
        // console.log('sample rate: ' + _recordRTC.sampleRate);
        _recordRTC.startRecording();
    },

    stopRecording:function(uploadPath) {

        // console.log('sample rate: ' + _recordRTC.sampleRate);

        _recordRTC.stopRecording(function(audioVideoMURL) {
            console.log('stopped recording...');
            console.log('recordrtc stop sample rate: ' + _recordRTC.sampleRate);

            $http({
                method : 'POST',
                url : uploadPath,
                data : _recordRTC.getBlob()
            }).success(function(data) {
                console.log('POST /audio Success');

            }).error(function() {
                console.log('POST /audio error'); 
            });
        });

    },
  };

    return Audio;

});