angular.module('StartedApp').factory('mesajesFactory',['$firebaseArray','$firebaseObject',function ($firebaseArray,$firebaseObject) {
  var mensajesRef= new Firebase('https://tuchancephp.firebaseio.com/'+'chats');
  var mensajeFactory={};

  mensajeFactory.addMessage=function (path,mensaje) {
    console.log(path);
    return mensajesRef.child(path).child(Firebase.ServerValue.TIMESTAMP).set(mensaje);
  };

  return mensajeFactory;
}]);
