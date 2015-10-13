'use strict';
app.controller('LoaderCtrl', function($scope, $modalInstance){

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});