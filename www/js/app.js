// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $state, $rootScope, authentication) {

  $rootScope.$on('$stateChangeStart', function(event,next, nextParams, fromState){
 
    if(!authentication.isAuthenticated){
       if(next.name.indexOf('login')==-1) {
        event.preventDefault();
        $state.go('login-tabs.login');
      }
    };
    var obj = JSON.parse(authentication.loadCredentials);
    $rootScope.userData = typeof obj == 'string' ? JSON.parse(obj) : obj;    
  });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
   $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    .state('tab.dash', {
      url: '/dash/:id',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.appointment', {
        url: '/appointment',
        views: {
          'tab-appointment': {
            templateUrl: 'templates/tab-appointment.html',
            controller: 'AppointmentCtrl'
          }
        }
    })

    .state('tab.detail', {
      url: '/details',
      views: {
        'tab-appointment': {
          templateUrl: 'templates/appointment-detail.html',
          controller: 'AppointmentDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    .state('login-tabs', {
      url: '/login-tabs',
      abstract: true,
      templateUrl: 'templates/login-tabs.html'
    })
    
    .state('login-tabs.login', {
      url: '/login',
      views: {
        'login-tab': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login-tabs/login');

});
