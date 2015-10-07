'use strict';

app.factory('Audio', [
   '$window', '$http'
   ($window, $http) ->
     navigator.userMedia = (
       $window.navigator.getUserMedia ||
       $window.navigator.webkitGetUserMedia ||
       $window.navigator.mozGetUserMedia ||
       $window.navigator.msGetUserMedia)

     navigator.getUserMedia {audio:true, video:false},
       (stream) ->
         $window.recordRTC = RecordRTC(stream)
         return
       (err) ->
         console.log(err)
         return

     return {
       UploadLastRecording: ->
         blob = $window.recordRTC.getBlob()
         fd = new FormData()
         fd.append('audio', blob)
         $http.post('/path/to/server', fd,
           {
             transformRequest: angular.identity
             headers: {'Content-Type' : undefined }
           }).success(data) ->
           console.log("Posted sound")
         return
     }
 ])