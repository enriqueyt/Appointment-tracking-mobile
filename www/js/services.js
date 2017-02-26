angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('authentication', authentication)
.factory('appointmentServices', appointmentServices)

authentication.$inject = ['$q', '$http'];

function authentication($q, $http){
  var token_local = 'IAM',
      isAuthenticated = false,
      authToken = undefined,
      rol = '';

  var cargar_credenciales = function(){
    var _token = window.localStorage.getItem(token_local);
    if(_token){
      return credenciales_usuario('main', _token);
    } 
    return null;
  };

  var guardar_credenciales = function(_rol, data){
    window.localStorage.setItem(token_local, JSON.stringify(data) );
    credenciales_usuario(token_local, data)
  };

  var credenciales_usuario = function(_rol, data){
    isAuthenticated = (data != null ? true : false);
    authToken = (data != null ? JSON.stringify(data) : data);
    return authToken;
  };

  var login = function(user){

    return $q(function(resolve, reject){
      var request = {
        method:'POST',
        url:'http://localhost:3000/auth/login',
        data:user
      };

      $http(request)
        .then(function(data){
          data = data.data;
          guardar_credenciales('main', data)
          resolve(data);
        },function(error){
          console.log('error all llamar al login')
          console.log(error)
          reject(error);
        })        
    });
  };

  var logout = function(){
    var authToken = undefined;
    isAuthenticated = false;
    window.localStorage.removeItem(token_local);
  };
  
  cargar_credenciales();

  return {
    login: login,
    lofout:logout,
    isAuthenticated:isAuthenticated,
    userData:authToken,
    loadCredentials:cargar_credenciales()
  }
};

appointmentServices.$inject = ['$q', '$http'];

function appointmentServices($q, $http){

  var dashboard = function(_id){
    return $q(function(resolve, reject){
      $http.get('http://localhost:3000/api/appointment/groupByuser/'+_id+'/'+true)
      .then(function(data){
        resolve(data.data);
      },function(error){
        reject(error.data);
      });

    });
  };

  var callAppointmentsByUser = function(_id){
    return $q(function(resolve, reject){
      
      $http.get('http://localhost:3000/api/appointment/appointments/byUser/'+_id+'/10/0')
      .then(function(data){
        console.log(data)
        resolve(data);
      },function(error){
        console.log('error all llamar al login')
        console.log(error)
        reject(error);
      });

    });
  };

  var updateAppointment = function(appointment){
    return $q(function(resolve, reject){
    
      var req = {
        method:'PUT',
        url:'http://localhost:3000/api/appointment/'+appointment._id,
        data:appointment
      };
      
      $http(req)
        .then(function(data){
          console.log(data)
          resolve(data);
        }, function(err){
          console.log(err)
          reject(err);
        });
    });
  };

  return {
    callAppointmentsByUser : callAppointmentsByUser,
    updateAppointment : updateAppointment,
    dashboard:dashboard
  }

};