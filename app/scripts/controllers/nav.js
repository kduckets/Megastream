'use strict';

app.controller('NavCtrl', function ($scope, $location, Post, Auth, $http, $cookies) {
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;

//TODO: move this to angular route
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

  };

});