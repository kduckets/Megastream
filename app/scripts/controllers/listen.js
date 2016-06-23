'use strict';
app.controller('ListenCtrl', function($scope, $window, $http, Audio, $uibModal, $modalStack, $location, $cookies, Auth){
     $scope.alerts = [
    
  ];
    var uid = $cookies.get('uid');
    var userId = {'user': uid};
      $scope.user = Auth.user;

      $scope.signedIn = Auth.signedIn;
  
    $scope.showResults = false;

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
              console.log(data);
                $scope.artist = data.artist;
                $scope.track = data.track;
                $scope.album = data.first_album;
                if(data.first_album == 'No result'){
                  $scope.onListen();
                  return;
                }
                $scope.showResults = false;
                $scope.getDiscogsData($scope.artist, $scope.album, $scope.track);
 
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

$scope.getDiscogsData = function(artist, album, track){

    
    var apiKey = 'NkGkQmxCMALmQCBYYdnZ';
    var apiSecret = 'npMAgZwCuvfselUUpysRCqyXdQUrqcZh';
    var artist_str = artist.replace(/[^\w\s]|_/g, "+").replace(/\s+/g, "+"); 
    var album_str = album.replace(/[^\w\s]|_/g, "+").replace(/\s+/g, "+");
    var track_str = track.replace(/[^\w\s]|_/g, "+").replace(/\s+/g, "+");
    var discogs_query = 'artist='+ artist_str + '&track=' + track_str + '&format=vinyl' + '&key=' + apiKey + '&secret=' + apiSecret;
      $http({
  method: 'GET',
  url : 'https://api.discogs.com/database/search?' + discogs_query
  }).then(function successCallback(response) {
  if(response.data.results[0]){
  $scope.showResults = true;
  $scope.releaseResults = response.data.results;
  $scope.album_image = response.data.results[0].thumb,
  console.log($scope.releaseResults);
    }
  })
};


});

   