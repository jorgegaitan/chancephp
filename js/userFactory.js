angular.module('StartedApp').factory('UsersFactory',['$firebaseArray','$firebaseObject',function ($firebaseArray,$firebaseObject) {

  var usersRef= new Firebase('https://tuchancephp.firebaseio.com/'+'users');
  var UsersFactory={};
  UsersFactory.getUsers=function () {
    return $firebaseObject(usersRef);
  };
  UsersFactory.getUser=function (id) {
    return $firebaseObject(usersRef.child(id));
  };
  UsersFactory.registrarConversacion=function (id,id2,foto,username,path) {
    conversacion={
      username:username,
      ruta:path,
      foto:foto
    };
    console.log(id2);
    return usersRef.child(id).child("conversaciones").child(id2).set(conversacion);
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

  UsersFactory.getConversaciones=function(id){
    return $firebaseArray(usersRef.child(id).child("conversaciones"));
  };
  return UsersFactory;
}]);
