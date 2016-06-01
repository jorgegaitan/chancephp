var app=angular.module('StartedApp',['ngMaterial','ngMdIcons','ui.router','firebase']);
app.run(['$rootScope','$state',function($rootScope,$state) {

  $rootScope.$on('$stateChangeError',function (event, toState, toParams, fromState, fromParams, error) {
    console.log(error);
    if(error=="AUTH_REQUIRED"){
      $state.transitionTo('login');
    }
  });
}]);

//  MODULO DE LOGIN CON ANGULAR- ANGULARFIRE Y FIREBASE
app.controller('LoginCtrl',['$scope', '$mdBottomSheet','$mdSidenav','$state','$firebaseObject','authFactory','UsersFactory', function($scope, $mdBottomSheet, $mdSidenav, $state, $firebaseObject,authFactory,UsersFactory){
var imagePath = 'http://pre05.deviantart.net/a4f9/th/pre/i/2012/083/e/8/foto_de_perfil__jouez_by_crizaros-d4trv7k.jpg';
  $scope.cuenta={
    email:'',
    password:''
  };

  var ref= new Firebase('https://tuchancephp.firebaseio.com/');
  $scope.login=function () {
    var result= authFactory.authUser($scope.cuenta.email,$scope.cuenta.password);
    result.then(function (authData){
      $state.transitionTo('vendedores.perfil');
      sessionStorage.setItem("Email",$scope.cuenta.email);
    },function (error) {
      console.log("an Authentication error occurred ", error);
    });

  };
    $scope.empleados=[{
      foto : imagePath,
      nombre: 'Jorge Gaitan',
      cargo: 'cargo Empleado'
    }, {
      foto : imagePath,
      nombre: 'Santiago Rueda',
      cargo: 'cargo Empleado'
    }, {
      foto : imagePath,
      nombre: 'Nombre Empleado',
      cargo: 'Cargo Empleado'
    }];
}]);

app.controller('ChatCtrl',['$scope', '$mdBottomSheet','$state','$firebaseObject','mesajesFactory','UsersFactory', function($scope, $mdBottomSheet, $state, $firebaseObject,mesajesFactory,UsersFactory){

  $scope.userFrom={
    id:"",
    nombre:"nombre1",
    apellidos:"apellido",
    foto:"http://pre05.deviantart.net/a4f9/th/pre/i/2012/083/e/8/foto_de_perfil__jouez_by_crizaros-d4trv7k.jpg"
  };
  $scope.mensaje="";
  console.log('estoy en el controlador de enviar mensaje');
  console.log(UsersFactory.getUser(10));
  $scope.send=function() {
    id=1094;
    mensaje={
      hora:"13:10",
      mensaje:$scope.mensaje
    };
    console.log("id del admin "+$scope.idsend);
    console.log("id del usuario "+$scope.userFrom.id);
    console.log(mensaje);

    var path=id<$scope.userFrom.id ? id+'-'+$scope.userFrom.id : $scope.userFrom.id+'-'+id;
      var result=mesajesFactory.addMessage(path,mensaje);
      result.then(function (data) {
        console.log("mensaje Enviado correctamente");
        conversacion={
          username:$scope.userFrom.nombre+" "+$scope.userFrom.apellidos,
          ruta:path
        };
        UsersFactory.registrarConversacion(id,conversacion);
      });
  };

  $scope.mostrarDetalles=function (data) {
    console.log(sessionStorage.getItem("Email"));
    $scope.userFrom=data;
  };
}]);

//CONTROLADOR PRINCIPAL DE LA APLICACION
//
//
app.controller('AppCtrl', ['$scope', '$mdBottomSheet','$mdSidenav','$state','authFactory', function($scope,$mdBottomSheet, $mdSidenav,$state,authFactory){
  $scope.email=sessionStorage.getItem("Email");

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.loadView=function (viewState) {
    $state.go(viewState);
  };

  $scope.cupon = {
  name: '',
  serie:'0956',
  valApuesta:'20000'
};
}]);

//ESTADOS DE LA APLCIACION
app.config(function ($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('login',{
      url:"/login",
      controller:'LoginCtrl',
      templateUrl:'view/login.html'
    })
    .state('vendedores',{
      url:'/modVenta',
      abstract: true,
      templateUrl:'view/viewVendedores.html',
      controller:'AppCtrl'
    })
    .state('vendedores.venta', {
      url:'/venta',
      templateUrl: 'view/venta.html',
      resolve:{
        "currentAuth":["authFactory",function(authFactory){
            var auth=authFactory.auth();
            console.log(auth);
            return auth.$requireAuth();
        }]
      }
    })

    .state('vendedores.perfil', {
      url:'/perfil',
      templateUrl:'view/perfil.html',
      resolve:{
        "currentAuth":["authFactory",function(authFactory){
            var auth=authFactory.auth();
            console.log(auth);
            return auth.$requireAuth();
        }]
      }
    })

    .state('vendedores.estadisticasVentas', {
      url:'/estadisticasVentas',
      templateUrl:'view/estadisticas.html',
      resolve:{
        "currentAuth":["authFactory",function(authFactory){
            var auth=authFactory.auth();
            console.log(auth);
            return auth.$requireAuth();
        }]
      }
    })

    .state('vendedores.listaVentas', {
      url:'/listaVentas',
      templateUrl:'view/listaVentas.html',
      resolve:{
        "currentAuth":["authFactory",function(authFactory){
            var auth=authFactory.auth();
            console.log(auth);
            return auth.$requireAuth();
        }]
      }
    })

    .state('vendedores.mensajes', {
      url:'/mensajes',
      templateUrl:'view/mensajes.html',
      resolve:{
        "currentAuth":["authFactory",function(authFactory){
            var auth=authFactory.auth();
            console.log(auth);
            return auth.$requireAuth();
        }]
      }
    })

    .state('admin',{
      url:'/modAdmin',
      abstract:true,
      templateUrl:'view/viewAdmin.html',
      controller:'AdminCtrl',
      resolve:{
        simpleObj:  function(){
           return {value: 'simple!'};
        }
      }
    })

    .state('admin.dashboard',{
      url:'/dashboard',
      templateUrl:'view/dashboard.html'
    })

    .state('admin.perfil', {
      url:'/perfil',
      templateUrl:'view/perfil.html'
    })

    .state('admin.listaEmpleados', {
      url:'/listaEmpleados',
      templateUrl:'view/empleados.html'
    })

    .state('admin.chat', {
      url:'/chats',
      templateUrl:'view/chat.html',
      controller:'ChatCtrl'
    })

    .state('admin.listaLoterias', {
      url:'/loterias',
      templateUrl:'view/listaLoterias.html'
    });

    $urlRouterProvider.otherwise("/login");
});
