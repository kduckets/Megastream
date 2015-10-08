'use strict';

app.factory('Audio', function($window, $http) {


    var Audio = {

    startRecording:function() {
        console.log('starting to record...');
        // console.log('sample rate: ' + _recordRTC.sampleRate);
       var recordRTC = RecordRTC(mediaStream);
      recordRTC.startRecording();
        recordRTC.stopRecording(function(audioURL) {
          audio.src = audioURL;

    var recordedBlob = recordRTC.getBlob();
    recordRTC.getDataURL(function(dataURL) { });
});
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