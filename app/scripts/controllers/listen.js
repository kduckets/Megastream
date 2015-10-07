'use strict';
app.controller('ListenCtrl', function($scope, $window, Audio){

    $scope.onRecord = Audio.startRecording;

});