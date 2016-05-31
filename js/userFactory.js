angular.module('StartedApp').factory('UsersFactory',['$firebaseArray','$firebaseObject',function ($firebaseArray,$firebaseObject) {

  var usersRef= new Firebase('https://tuchancephp.firebaseio.com/'+'users');
  var users=$firebaseArray(usersRef);
  console.log(users);
  var UsersFactory={
    getProfile:function (uid) {
      return $firebaseObject(usersRef.child(uid));
    },
    getDisplayName: function () {
      return users.$getRecord(uid).displayName;
    },
    all:users
  };
  UsersFactory.getUser=function (id) {
    return $firebaseObject(usersRef.child(id));
  };
  UsersFactory.addUser=function (usuario) {
    var user={
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
