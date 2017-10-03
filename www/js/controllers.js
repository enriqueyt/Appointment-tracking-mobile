
angular
  .module('starter.controllers', [])

  .controller('DashCtrl', DashCtrl)

  .controller('AppointmentCtrl', AppointmentCtrl)

  .controller('AppointmentDetailCtrl', AppointmentDetailCtrl)

  .controller('LoginCtrl', LoginCtrl)

  .controller('AccountCtrl', AccountCtrl)

  .controller('AddProspectCtrl', AddProspectCtrl);

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
  
  AddProspectCtrl.$inject = ['$scope', '$rootScope', 'prospectServices', 'authentication'];

  function AddProspectCtrl($scope, $rootScope, prospectServices, authentication){
    $scope.lstProspects=[];
    $scope.data = {
      showDelete: false
    };
    $scope.addProspect=function(){
      $scope.lstProspects.push({name:'',phone:''});
    };
    $scope.deleteProspect=function(prospect){
      var index=$scope.lstProspects.indexOf(prospect);
      if(index!=-1)$scope.lstProspects.splice(index,1);
    };
    $scope.saveProspects=function(){
      console.log($scope.lstProspects)
      
      prospectServices
        .saveProspect(JSON.parse(authentication.loadCredentials).data.id, $scope.lstProspects)
        .then(function(data){
          console.log(data)
          if(data.data){
            $scope.lstProspects=[];
          }
        }, function(err){
          console.log(err);
        })
    };
  };
  DashCtrl.$inject = ['$scope', '$rootScope', '$stateParams', '$ionicPopup', 'appointmentServices', 'authentication'];

  function DashCtrl($scope, $rootScope, $stateParams, $ionicPopup, appointmentServices, authentication){
    
    if($stateParams.id)
      $scope.id = $stateParams.id
    else
      $scope.id = JSON.parse(authentication.loadCredentials).data.id;

    $scope.name=JSON.parse(authentication.loadCredentials).data.name;
    $scope.avatar=JSON.parse(authentication.loadCredentials).data.avatar;

    appointmentServices
        .dashboard($scope.id)
        .then(function(data){ 
  
          if(data.error){
            var alert = $ionicPopup.alert({
              title:data.message.message,
              template:JSON.stringify(data)
            });
          }
          else{
            console.log(data.data)
            if(data.data.length==0){
              $scope.attendedAppointments=0;
              $scope.unattendedAppointments=0;
              $scope.efectiveAppointments=0;
            }
            else{
              $scope.attendedAppointments=data.data.filter(item=>item._id==true)[0].count;
              $scope.unattendedAppointments=data.data.filter(item=>item._id==false)[0].count;
            }

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
      
    /*appointmentServices
      .callAppointmentsByUser($rootScope.userData.data.id)
      .then(function(data){        
        $scope.lstAppointment = data.data.data;
      }, function(err){
        console.log(err)
      });
*/
    appointmentsUserByDay($rootScope.userData.data.id, moment(new Date()).format("YYYY-MM-DD"))

    $scope.showDetails = function(appointment){
      $rootScope.currentAppointment = appointment;      
    };

    $scope.mydate=new Date();
  
    $scope.follow = function(){
      var tomorrow = new Date($scope.mydate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      $scope.mydate=tomorrow;
      appointmentsUserByDay($rootScope.userData.data.id, moment($scope.mydate).format("YYYY-MM-DD"))
    };

    $scope.back = function(){      
      var yesterday= new Date($scope.mydate);
      yesterday.setDate(yesterday.getDate() - 1);
      $scope.mydate=yesterday;
      appointmentsUserByDay($rootScope.userData.data.id, moment($scope.mydate).format("YYYY-MM-DD"))
    };

    function appointmentsUserByDay(_id,_date){
      appointmentServices
        .callAppointmentsUserByDay(_id,_date)
        .then(function(data){
          $scope.lstAppointment=data.data.data||[];
          $scope.lstAppointment.forEach(function(element) {
              element.appointmentDate=moment(element.appointmentDate).format("YYYY-MM-DD hh:mm:ss")
          });
        })
        .catch(function(err){
          console.log(err)
        });
    }

  };

  AppointmentDetailCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPopup', 'appointmentServices'];

  function AppointmentDetailCtrl($scope, $rootScope, $state, $stateParams, $ionicPopup, appointmentServices){
    $scope.lstproducts=[];
    $scope.howWasAppoint='';    
    $scope.date=$rootScope.currentAppointment.appointmentDate;
    $scope.name=$rootScope.currentAppointment.client.name;
    $scope.phone=$rootScope.currentAppointment.client.phone;
    $scope.description=$rootScope.currentAppointment.description;
    $scope.address=$rootScope.currentAppointment.address;
    $scope.wasAttended=$rootScope.currentAppointment.wasAttended;
    $scope.howWasAppoint=$rootScope.currentAppointment.howWasAppointment;
    $scope.avatar=$rootScope.currentAppointment.client.avatar;
    console.log($rootScope.currentAppointment)
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
        wasAttended:document.howasForm.wasAttended.value,
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
              title:'Exito!',
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