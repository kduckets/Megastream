'use strict';

app.controller('AuthCtrl', function ($scope, $location, Auth, user, $http, $window, $cookies, $uibModal) {
  // if (user) {
  //   $location.path('/');
  // }

  $scope.login = function () {
          
    Auth.login($scope.user).then(function () {   
        $location.path('/');
      });
  };

$scope.register = function () {
  Auth.register($scope.user).then(function(user) {
    return Auth.login($scope.user).then(function() {
      user.username = $scope.user.username;
      var userData = {'user': Auth.user.uid};
       $cookies.put('uid', userData.user);
      return Auth.createProfile(user);
    }).then(function() {

       var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/disconnect.html',
      controller: 'DiscCtrl',
    });
        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function() {});

    });
  }, function(error) {
    $scope.error = error.toString();
  });
};


});