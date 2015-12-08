 /* global app:true */
/* exported app */

'use strict';

/**
 * @ngdoc overview
 * @name debateMateApp
 * @description
 * # debateMateApp
 *
 * Main module of the application.
 */

var app = angular
  .module('megaStreamApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'smart-table',
    'ui.bootstrap',
    'timer',
    'angular-spinkit',
    'ngLoadingSpinner'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
  templateUrl: 'views/listen.html',
  controller: 'ListenCtrl'
      })
      .when('/register', {
  templateUrl: 'views/register.html',
  controller: 'AuthCtrl',
  resolve: {
    user: function(Auth) {
      return Auth.resolveUser();
       }
      }
      })
     .when('/login', {
  templateUrl: 'views/login.html',
  controller: 'AuthCtrl',
  resolve: {
    user: function(Auth) {
      return Auth.resolveUser();
    }
  }
})
    .when('/users/:userId', {
  templateUrl: 'views/profile.html',
  controller: 'ProfileCtrl'
})

.when('/?oath_token=:oathToken', {
         template: '',
         controller: function ($location,$rootScope) {
            console.log('got to oauth route');
           var hash = $location.path().substr(1);
          
          var splitted = hash.split('&');
          var params = {};

         for (var i = 0; i < splitted.length; i++) {
           var param  = splitted[i].split('=');
            var key    = param[0];
            var value  = param[1];
             params[key] = value;
             $rootScope.accesstoken=params;
             console.log('access token',$rootScope.accesstoken);
           }
           $location.path("/");
         }
       })

      .otherwise({
        redirectTo: '/'
      });
      // use the HTML5 History API
        $locationProvider.html5Mode(true);
  });
app.constant('FIREBASE_URL', 'https://megastream.firebaseIO.com');

