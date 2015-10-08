'use strict';
app.controller('ListenCtrl', function($scope, $window, $http, Audio){

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
        $scope.recordedBlob = recordRTC.getBlob();


        $http({
                method : 'POST',
                headers: {
   				'Content-Type': 'application/octet-stream',
   				'Accept':'application/json'
 				},
 				
                url : 'https://developer.echonest.com/api/v4/track/upload?api_key=LFJOHTELG1WX5SPLW&filetype=wav&track=' + $scope.recordedBlob
               
            }).success(function(data) {
                console.log('POST /audio Success');

            }).error(function() {
                console.log('POST /audio error'); 
            });

    })
    recordRTC.startRecording();
		}).catch(function(error) {
   			 console.error(error);
		});
		};

});