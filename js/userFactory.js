angular.module('StartedApp').factory('UsersFactory',['$firebaseArray','$firebaseObject',function ($firebaseArray,$firebaseObject) {

  var usersRef= new Firebase('https://tuchancephp.firebaseio.com/'+'users');
  var UsersFactory={
    getProfile:function (uid) {
      return $firebaseObject(usersRef.child(uid));
    },
    getDisplayName: function () {
      return users.$getRecord(uid).displayName;
    }
  };
  UsersFactory.getUsers=function () {
    return $firebaseObject(usersRef);
  };
  UsersFactory.getUser=function (id) {
    return $firebaseObject(usersRef.child(id));
  };
  UsersFactory.registrarConversacion=function (id,conversacion) {
    return usersRef.child(id).child("conversaciones").child(conversacion.username).set(conversacion);
  };
  UsersFactory.addUser=function (usuario) {
    var user={
      foto:'http://pre05.deviantart.net/a4f9/th/pre/i/2012/083/e/8/foto_de_perfil__jouez_by_crizaros-d4trv7k.jpg',
      nombre:usuario.nombre,
      apellidos:usuario.apellido,
      id:usuario.id,
      correo:usuario.correo,
      cargo:usuario.cargo,
      edad:usuario.edad,
      rol:usuario.rol,
      online:false,
      localizacion:'',
      bloqueado:false};
    usersRef.child(user.id).set(user);
  };
  return UsersFactory;
}]);
