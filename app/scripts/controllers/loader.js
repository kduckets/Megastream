'use strict';
<<<<<<< HEAD

app.controller('ModalController', function($scope, close) {

  // when you need to close the modal, call close
  close("Success!");
=======
app.controller('LoaderCtrl', function($scope, $modalInstance){

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
>>>>>>> origin/master
});