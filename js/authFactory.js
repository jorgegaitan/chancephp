angular.module('StartedApp').factory('authFactory',['$firebaseAuth',function ($firebaseAuth) {
  var authFactory={};
  var ref= new Firebase('https://tuchancephp.firebaseio.com/');
  var auth=$firebaseAuth(ref);

  authFactory.createUser=function (email,password) {
    return auth.$createUser({
      email:email,
      password:password
    });
  };
  authFactory.authUser= function(email,password){
    return auth.$authWithPassword({
      email: email,
      password:password
    });
  };
  authFactory.auth=function () {
    return auth;
  };
  authFactory.logout=function () {
    auth.$unauth();
  };

  return authFactory;
}]);
