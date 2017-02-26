angular
  .module('starter.controllers', [])

  .controller('DashCtrl', DashCtrl)

  .controller('AppointmentCtrl', AppointmentCtrl)

  .controller('AppointmentDetailCtrl', AppointmentDetailCtrl)

  .controller('LoginCtrl', LoginCtrl)

  .controller('AccountCtrl', AccountCtrl);

  LoginCtrl.$inject = ['$scope', '$state', '$ionicPopup', 'authentication'];

  function LoginCtrl($scope, $state, $ionicPopup, authentication){    

    $scope.user = {};

    $scope.settings = {
      enableFriends: true
    };

    $scope.login = function(){
      authentication
        .login($scope.user)
        .then(function(data){
          if(data.success){
            $state.go('tab.dash', {id:data.data.id})
          }
          else{
            var alert = $ionicPopup.alert({
              title:'Error',
              template:data.message
            });
          }

        })
        .catch(function(error){
          console.log('error')
          console.log(error)
          var alert = $ionicPopup.alert({
              title:'Error',
              template:error
            });
        })
    };
  };

  AccountCtrl.$inject = ['$scope'];

  function AccountCtrl($scope){
    $scope.settings = {
      enableFriends: true
    };
  };

  DashCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$ionicPopup', 'appointmentServices', 'authentication'];

  function DashCtrl($scope, $rootScope, $stateParams, $ionicPopup, appointmentServices, authentication){
    console.log('dashboard eyt');

    if($stateParams.id)
      $scope.id = $stateParams.id

    $scope.name=JSON.parse(JSON.parse(authentication.loadCredentials)).data.name;

    console.log('DashCtrl')
    console.log($scope.id)

    appointmentServices
        .dashboard($scope.id)
        .then(function(data){ 
          console.log(data);
          if(data.error){
            var alert = $ionicPopup.alert({
              title:data.message.message,
              template:JSON.stringify(data)
            });  
          }
          else{
            console.log(data.data)
            $scope.attendedAppointments=data.data.filter(item=>item._id==true)[0].count;
            $scope.unattendedAppointments=data.data.filter(item=>item._id==false)[0].count;
          }
        }, function(err){
          var alert = $ionicPopup.alert({
              title:'Error actualizando una cita',
              template:err.data
            });
        });

  };

  AppointmentCtrl.$inject = ['$scope', '$rootScope', '$state', 'appointmentServices'];

  function AppointmentCtrl($scope, $rootScope, $state, appointmentServices){
    
    appointmentServices
      .callAppointmentsByUser($rootScope.userData.data.id)
      .then(function(data){        
        $scope.lstAppointment = data.data.data;
      }, function(err){
        console.log(err)
      });

    $scope.showDetails = function(appointment){
      $rootScope.currentAppointment = appointment;      
    };

  };

  AppointmentDetailCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPopup', 'appointmentServices'];

  function AppointmentDetailCtrl($scope, $rootScope, $state, $stateParams, $ionicPopup, appointmentServices){
    $scope.lstproducts=[];
    $scope.howWasAppoint='';
    $scope.date=$rootScope.currentAppointment.appointmentDate;
    $scope.name=$rootScope.currentAppointment.client.name;
    $scope.phone=$rootScope.currentAppointment.client.phone;
    $scope.description=$rootScope.currentAppointment.description;
    $scope.wasAttended=$rootScope.currentAppointment.wasAttended;    
    $scope.howWasAppoint=$rootScope.currentAppointment.howWasAppointment;
    
    if($rootScope.currentAppointment.products.length>0){
      $scope.sold=true;
      for(var i=0, len = $rootScope.currentAppointment.products.length; i<len;i++){    
        $scope.lstproducts.push({
          placeholder: $rootScope.currentAppointment.products[i],
          name: $rootScope.currentAppointment.products[i]
        });
      }  
    }
    
    $scope.addProduct = function(){
      $scope.lstproducts.push({
        name:'',
        placeholder:'Ingrese Producto'
      });      
    };
    
    $scope.updateAppointment = function(){

      var query = {
        _id:$rootScope.currentAppointment._id,
        wasAttended:document.getElementsByName('wasAttended')[0].value,
        howWasAppointment:document.howasForm.howWasAppointment.value        
      };

      if($scope.lstproducts!==undefined){
        query.products=[];
        $scope.lstproducts.forEach(function(element, index, array){          
          query.products.push(element.name);
        });
      };
      
      appointmentServices
        .updateAppointment(query)
        .then(function(data){ 
          console.log(data);
          if(data.data.error){
            var alert = $ionicPopup.alert({
              title:data.data.message.message,
              template:err.data
            });  
          }
          else{
            var alert = $ionicPopup.alert({
              title:'Error',
              template:'Se actualizo correctamente'
            });
          }
        }, function(err){
          var alert = $ionicPopup.alert({
              title:'Error actualizando una cita',
              template:err.data
            });
        });

    };
  };