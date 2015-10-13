'use strict';
app.controller('ListenCtrl', function($scope, $window, $http, Audio, $uibModal){

    $scope.showResults = false;

    $scope.onListen = function()
		{
            $scope.spin('lg');

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


         $http.post('/api/uploadtrack', base64blob)
            .success(function(data) {
                $scope.artist = data.artist;
                $scope.track = data.track;
                $scope.album = data.first_album;
                $scope.album_image = data.first_image;
                $scope.showResults = data.show_discogs_results;
                $scope.releaseResults = data.release_results;
                 console.log(data.fingerprint_obj);
                console.log(data.discogs_obj);
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

        //modal stuff
    $scope.animationsEnabled = true;

  $scope.spin = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/views/loader.html',
      controller: 'LoaderCtrl',
      size: size
    });

    modalInstance.result.then(function () {
     console.log('Modal dismissed at: ' + new Date());
     });
    };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

   