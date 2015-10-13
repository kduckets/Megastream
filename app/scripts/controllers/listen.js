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
    recordRTC.setRecordingDuration(10 * 1000).onRecordingStopped(function() {
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
                $scope.artist = data.artist;
                $scope.title = data.title;
                $scope.album = data.album;
                $scope.album_image = data.image_test;
                console.log(data.test);
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

		};//end onListen()

         //testing Oauth implementation
         //TODO: move to modal
         $scope.discogsLogin = function()
        {
            $http.get('/api/authorize')
            .success(function(data) { 

            window.location.replace(data.url);      
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        };

            /* $http.get('/api/callback')
            .success(function(data) {  
                $scope.discogs = data;      
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });*/



});

   