angular.module('StartedApp').factory('mesajesFactory',['$firebaseArray','$firebaseObject',function ($firebaseArray,$firebaseObject) {
  var mensajesRef= new Firebase('https://tuchancephp.firebaseio.com/'+'chats');
  var mensajeFactory={};

  mensajeFactory.forUsers=function (id1,id2) {
    var paht=id1<id2 ? id1+'/'+id2 : id2+'/'+id1;
    return $firebaseArray(userMensajesRef.child(path));
  };
  mensajeFactory.addMessage=function (path,mensaje) {
    console.log(path);
    return mensajesRef.child(path).child(mensaje.hora).set(mensaje);
  };

  return mensajeFactory;
}]);
