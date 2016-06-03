var app=angular.module('StartedApp',['ngMaterial','ngMdIcons','ui.router','firebase','StartedApp.controllers']);
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
      new Firebase('https://tuchancephp.firebaseio.com/users')
      .orderByChild('correo').equalTo($scope.cuenta.email).once('value', function(snap){
        for(user in snap.val()){
          var usuario=snap.val()[user];
          sessionStorage.setItem("user", JSON.stringify(usuario));
          if(usuario.rol.toUpperCase()=="ADMINISTRATIVO"){
              $state.transitionTo('admin.dashboard');
          }
            else {
                $state.transitionTo('vendedores.perfil');
            }
        }

      });
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
app.controller('sliderCtrl',['$scope','$mdBottomSheet','$state',function ($scope,$mdBottomSheet,$state) {
  $(document).ready(function(){
    $(".SlickCarousel").slick({
      rtl:false, // If RTL Make it true & .slick-slide{float:right;}
      autoplay:true,
      autoplaySpeed:2000, //  Slide Delay
      speed:800, // Transition Speed
      slidesToShow:6, // Number Of Carousel
      slidesToScroll:1, // Slide To Move
      pauseOnHover:false,
      appendArrows:$(".Container .Head .Arrows"), // Class For Arrows Buttons
      prevArrow:'<span class="Slick-Prev"></span>',
      nextArrow:'<span class="Slick-Next"></span>',
      easing:"linear",
      responsive:[
        {breakpoint:801,settings:{
          slidesToShow:3,
        }},
        {breakpoint:641,settings:{
          slidesToShow:3,
        }},
        {breakpoint:481,settings:{
          slidesToShow:1,
        }},
      ],
    });
  });
}]);
app.controller('ChatCtrl',['$scope', '$mdBottomSheet','$state','$firebaseObject','mesajesFactory','UsersFactory', function($scope, $mdBottomSheet, $state, $firebaseObject,mesajesFactory,UsersFactory){
  var user = JSON.parse(sessionStorage.getItem("user"));
  $scope.conversaciones=UsersFactory.getConversaciones(user.id);
  console.log(JSON.stringify(Firebase.ServerValue.TIMESTAMP));
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
        username=$scope.userFrom.nombre+" "+$scope.userFrom.apellidos;
        console.log($scope.userFrom.id);
        UsersFactory.registrarConversacion(id,$scope.userFrom.id,$scope.userFrom.foto,username, path);
        UsersFactory.registrarConversacion($scope.userFrom.id,id,user.foto,user.nombre+" "+user.apellidos,path);
      });
  };

  $scope.mostrarDetalles=function (data) {
    console.log(sessionStorage.getItem("Email"));
    $scope.userFrom=data;
    console.log($scope.userFrom);
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



}]);

app.controller('VentaCtrl',['$scope', '$mdBottomSheet','$state', function($scope,$mdBottomSheet,$state){
  $scope.cupon = {
  name: '',
  serie:'0956',
  valApuesta:'20000'
};
$scope.infoLoteria={
  nombre:'Astro Luna',
  img:'view/css/imagenes/loteria1.png',
  ultimoResultado:'22/04/2016',
  numero:'2876',
  serie:'Geminis'
};
  var imageLoteria1="view/css/imagenes/loteria1.png";
  var imageLoteria2="view/css/imagenes/loteria2.png";
  var imageLoteria3="view/css/imagenes/loteria3.png";
  $scope.loterias=[{
      foto:imageLoteria1,
      nombre:'Astro Luna',
      premio:'3.000.000',
      ultimoResultado:'23/04/2016',
      numero:'2908',
      serie:'Cancer'
  },{
      foto:imageLoteria2,
      nombre:'Chontico Noche',
      premio:'2.500.000',
      ultimoResultado:'25/05/2016',
      numero:'3245',
      serie:'034'
  },{
      foto:imageLoteria3,
      nombre:'Loteria del Cauca',
        premio:'4.000.000',
        ultimoResultado:'26/05/2016',
        numero:'6745',
        serie:'24'
  },{
      foto:imageLoteria1,
      nombre:'Astro Luna',
        premio:'3.000.000',
        ultimoResultado:'23/04/2016',
        numero:'2908',
        serie:'Tauro'
  },{
      foto:imageLoteria2,
      nombre:'Chontico Noche',
        premio:'2.500.000',
        ultimoResultado:'25/05/2016',
        numero:'3245',
        serie:'034'
  },{
      foto:imageLoteria3,
      nombre:'Loteria del Cauca',
      premio:'4.000.000',
      ultimoResultado:'26/05/2016',
      numero:'6745',
      serie:'24'
  },{
      foto:imageLoteria1,
      nombre:'Astro Luna',
        premio:'3.000.000',
        ultimoResultado:'23/04/2016',
        numero:'2908',
        serie:'Aries'
  }];
  $scope.mostrarDetallesLoteria=function (item) {
    $scope.infoLoteria.nombre=item.nombre;
    $scope.infoLoteria.img=item.foto;
    $scope.infoLoteria.ultimoResultado=item.ultimoResultado;
    $scope.infoLoteria.numero=item.numero;
    $scope.infoLoteria.serie=item.serie;
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
      controller:'VentaCtrl',
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
      templateUrl:'view/listaLoterias.html',
      controller:'sliderCtrl'
    });

    $urlRouterProvider.otherwise("/login");
});
