'use strict';
app.controller('ListenCtrl', function($scope, $window, Audio){

    $scope.onListen = function()
		{
	navigator.mediaDevices.getUserMedia({
    audio: true
		}).then(function(stream) {
    var recordRTC = RecordRTC(stream, {
    });

    // auto stop recording after 5 seconds
    recordRTC.setRecordingDuration(5 * 1000).onRecordingStopped(function() {
       console.log('recording stopped');
        var recordedBlob = recordRTC.getBlob();
        console.log(recordedBlob);
    })
    recordRTC.startRecording();
		}).catch(function(error) {
   			 console.error(error);
		});
		};

});