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
        
        // converts blob to base64
            var blobToBase64 = function(blob, cb) {
             var reader = new FileReader();
             reader.onload = function() {
                 var dataUrl = reader.result;
             var base64 = dataUrl.split(',')[1];
                cb(base64);
                 };
                 reader.readAsDataURL($scope.recordedBlob);
                };
        blobToBase64($scope.recordedBlob, function(base64){ // encode
            var base64blob = {'blob': base64};
            console.log(base64blob);
            
         $http.post('/api/uploadtrack', base64blob)
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        });

    });
    recordRTC.startRecording();
		}).catch(function(error) {
   			 console.error(error);
		});
		};



});

           /*     $http({
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
            });*/