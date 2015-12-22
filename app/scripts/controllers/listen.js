'use strict';
app.controller('ListenCtrl', function($scope, $window, $http, Audio, $uibModal, $modalStack, $location, $cookies, Auth){
     $scope.alerts = [
    
  ];
    var uid = $cookies.get('uid');
    var userId = {'user': uid};
      $scope.user = Auth.user;

      $scope.signedIn = Auth.signedIn;
  
    $scope.showResults = true;

    $scope.addToCollection = function(title, id){
            var body = {'release':id,
            'user': $scope.user.id
                 }; 

        $http.post('/api/addrelease', body)
            .success(function(data){
                //todo: handle errors
                //if successful..
                if(data.status == 'success'){
                 $scope.alerts.push({type:'success', msg: title + ' added to collection!'});
                }else{
                    $scope.alerts.push({type:'warning', msg: 'Something went wrong adding ' + title + ' to your collection'});
                }
                console.log('add to collection data', data);
            });

    }

    $scope.onListen = function(){

	navigator.mediaDevices.getUserMedia({
    audio: true
		}).then(function(stream) {
            $scope.spin();
    var recordRTC = RecordRTC(stream, {
    });

    // auto stop recording after 10 seconds
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
                console.log('release results', data.release_results);
             $modalStack.dismissAll();
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

         
    $scope.animationsEnabled = true;

  $scope.spin = function () {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/views/loader.html',
      controller: 'LoaderCtrl',
      backdrop:'static',
     windowClass: 'app-modal-window'
    });

    modalInstance.result.then(function () {
     console.log('Modal dismissed at: ' + new Date());
     });
    };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

   