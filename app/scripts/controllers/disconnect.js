'use strict';

app.controller('DiscCtrl', function ($scope, $location, $window, Post, Auth, $http, $cookies, $modalInstance) {

  //TODO: add loader during registration

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;

  $scope.discogsRegister = function(){
     var userData = {'user': Auth.user.uid};
       $http.post('/api/authorize', userData)
            .success(function(data) {
              $window.location.href = data.url;
  
    }, function (error) {
      $scope.error = error.toString();
    });
};

  $scope.cancel = function(){
     $modalInstance.close();

      $location.path('/');
  };

/*
 var qs = $location.search();
    if(qs.oauth_verifier){

    console.log('query string:', qs.oauth_verifier);
     var uid = $cookies.get('uid');
    var userId = {'user': uid};
  
    var body = {'verifier': qs.oauth_verifier, 'user': uid};

    $http.post('/api/callback', body)
            .success(function(data) {


    }, function (error) {
      $scope.error = error.toString();
    });

  };*/

});