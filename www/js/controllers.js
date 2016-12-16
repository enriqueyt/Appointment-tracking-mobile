angular
  .module('starter.controllers', [])

  .controller('DashCtrl', DashCtrl)

  .controller('AppointmentCtrl', AppointmentCtrl)

  .controller('AppointmentDetailCtrl', AppointmentDetailCtrl)

  .controller('LoginCtrl', LoginCtrl)

  .controller('AccountCtrl', AccountCtrl);

  LoginCtrl.$inject = ['$scope', '$state', '$ionicPopup', 'authentication'];

  function LoginCtrl($scope, $state, $ionicPopup, authentication){
    console.log('eyt')

    $scope.user = {};

    $scope.settings = {
      enableFriends: true
    };

    $scope.login = function(){
      authentication
        .login($scope.user)
        .then(function(data){
          if(data.data.success)
            $state.go('tab.dash', {id:data.data.doc.id})
          else{
            var alert = $ionicPopup.alert({
              title:'Error',
              template:data.data.info.message
            });
          }

        })
        .catch(function(error){
          console.log('error')
          console.log(error)
        })
    };


  };

  AccountCtrl.$inject = ['$scope'];

  function AccountCtrl($scope){
    $scope.settings = {
      enableFriends: true
    };
  };

  DashCtrl.$inject = ['$scope', '$stateParams'];

  function DashCtrl($scope, $stateParams){
    console.log('dashboard eyt');

    if($stateParams.id)
      $scope.id = $stateParams.id

    console.log('DashCtrl')
    console.log($scope.id)

  };

  AppointmentCtrl.$inject = ['$scope', 'Chats'];

  function AppointmentCtrl($scope, Chats){
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
  };

  AppointmentDetailCtrl.$inject = ['$scope', '$stateParams', 'Chats'];

  function AppointmentDetailCtrl($scope, $stateParams, Chats){

    $scope.chat = Chats.get($stateParams.chatId);
  };