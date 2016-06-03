angular.module('StartedApp').controller('AdminCtrl', ['$scope', '$mdBottomSheet','$mdSidenav','$state','$mdDialog','authFactory','UsersFactory', function($scope,$mdBottomSheet, $mdSidenav,$state,$mdDialog,authFactory,UsersFactory){

  $scope.showDialog=showDialog;
  $scope.items = [1, 2, 3];
  function showDialog ($event) {
    $scope.patentEl=angular.element(document.body);
    $mdDialog.show({
      parent:$scope.patentEl,
      targetEvent:$event,
      templateUrl:'view/agregarUsuario.html',
           locals:{
             items:$scope.items
           },
           controller:DialogController
    });
  }
  function DialogController($scope,$mdDialog,items){

    $scope.usuario={
      nombre:'',
      apellido:'',
      id:'',
      correo:'',
      password:'',
      cargo:'',
      edad:'',
      rol:'empleado'
    };
    $scope.closeDialog=function () {
      $mdDialog.hide();
    };
    $scope.addUser=function () {
      var result= authFactory.createUser($scope.usuario.correo,$scope.usuario.password);
      result.then(function (userData){
        UsersFactory.addUser($scope.usuario);
      },function (error) {
        console.log("an error occurred ", error);
      });
    };
  }
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.loadView=function (viewState) {
    $state.transitionTo(viewState);
  };

  var imageLoteria1="view/css/imagenes/loteria1.png";
  var imageLoteria2="view/css/imagenes/loteria2.png";
  var imageLoteria3="view/css/imagenes/loteria3.png";
  $scope.loterias=[{
      foto:imageLoteria1,
      nombre:'Astro Luna',
      sorteo:'08/05/2016'
  },{
      foto:imageLoteria2,
      nombre:'Chontico Noche',
      sorteo:'08/05/2016'
  },{
      foto:imageLoteria3,
      nombre:'Loteria del Cauca',
      sorteo:'08/05/2016'
  },{
      foto:imageLoteria1,
      nombre:'Astro Luna',
      sorteo:'08/05/2016'
  },{
      foto:imageLoteria2,
      nombre:'Chontico Noche',
      sorteo:'09/05/2016'
  },{
      foto:imageLoteria3,
      nombre:'Loteria del Cauca',
      sorteo:'09/05/2016'
  },{
      foto:imageLoteria1,
      nombre:'Astro Luna',
      sorteo:'08/05/2016'
  }];
  var imagePath = 'http://pre05.deviantart.net/a4f9/th/pre/i/2012/083/e/8/foto_de_perfil__jouez_by_crizaros-d4trv7k.jpg';
    $scope.empleados = UsersFactory.getUsers();
    
    $scope.topEmpleados = [{
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
