angular.module('starter.services', [])

.factory('Chats', function() {

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
.factory('prospectServices', prospectServices)

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

  var guardar_credenciales = function(_rol, data, done){
    window.localStorage.setItem(token_local, JSON.stringify(data) );
    credenciales_usuario(token_local, data)
    done(true);
  };

  var credenciales_usuario = function(_rol, data){
    isAuthenticated = (data != null ? true : false);
    authToken = data;
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
          
          guardar_credenciales('main', data, function(){
            resolve(data);
          });

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
        resolve(data);
      },function(error){
        console.log('error all llamar al login')
        console.log(error)
        reject(error);
      });

    });
  };

  var callAppointmentsUserByDay = function(createBy, _date){
    return $q(function(resolve, reject){
      
      $http.get('http://localhost:3000/api/appointment/appointmentsUserByDay/'+createBy+'/'+_date+'/10/0')
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
    dashboard:dashboard,
    callAppointmentsUserByDay:callAppointmentsUserByDay
  }

};

prospectServices.$inject = ['$q', '$http'];

function prospectServices($q, $http){

  var saveProspect = function(ref, prospect){
    return $q(function(resolve, reject){
      $http.post('http://localhost:3000/api/client/saveProspect/'+ref, prospect)
      .then(function(data){
        resolve(data.data);
      },function(error){
        reject(error.data);
      });

    });
  };

  return {
    saveProspect : saveProspect    
  }

};