'use strict';

app.controller('ModalController', function($scope, close) {

  // when you need to close the modal, call close
  close("Success!");
});