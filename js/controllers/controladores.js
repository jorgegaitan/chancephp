//Creamos un nuevo modulo para los controladores
var modController = angular.module('StartedApp.controllers' , []);
//creamos un controlados llamado AppCTRL
modController.controller('ApuestasCtrl' , function($scope , $http) {

	//codigo del controlador
	$scope.data = {
		total:0
	};
	$scope.apuestas = {};
	//aqui se almacenaran todas las ventas que hay en la BD.
	$scope.venta = [];

$scope.deleteVenta = function(id){
	//Objeto usado para hacer peticiones AJAX
	$http({
		method: 'DELETE' , // metodo utilizado
		url: '../phalcon/api/venta/'+id//endpoint	
	}).then(function succesCallback(response) {
		//funcion en caso de tener exito
		if(angular.fromJson(response.data).status == "OK") {
			$scope.getVentas();
		}
		}, function errorCallback(response) {
			//funcion en caso de que falle
			if (angular.fromJson(response.data).status ==="ERROR") {
				alert(angular.fromJson(response.data).messages[0]);
			}
		
	});
};

$scope.updateVenta = function(id){
	$http({
		method: 'PUT' , 
		url: '../phalcon/api/venta/'+id,
		data: angular.toJson($scope.ventas, true)
	}).then(function succesCallback(response) {
		console.log(angular.fromJson(response.data).status);
		if(angular.fromJson(response.data).status == "OK") {
			$scope.getVentas();
		}
		}, function errorCallback(response) {
			if (angular.fromJson(response.data).status ==="ERROR") {
				alert(angular.fromJson(response.data).messages[0]);
			}
		
	});
};

$scope.addApuesta = function(apuestaT){

	$http({
		method: 'POST' , 
		url: 'phalcon/api/apuestas',
		data: angular.toJson(apuestaT)
	}).then(function succesCallback(response) {
		if(angular.fromJson(response.data).status == "OK") {
			console.log('se agrego');
		}
		}, function errorCallback(response) {
			if (angular.fromJson(response.data).status ==="ERROR") {
				alert(angular.fromJson(response.data).messages[0]);
			}
		
	});
};

$scope.addTransaccion = function(){
	var user = JSON.parse(sessionStorage.getItem("user"));
	var transaccion = {
		id:$scope.nuevoId,
		idVendedor: user.id,
		costoTotal: $scope.data.total
	};

	$http({
		method: 'POST' , 
		url: 'phalcon/api/transaccion',
		data: angular.toJson(transaccion)
	}).then(function succesCallback(response) {
		if(angular.fromJson(response.data).status == "OK") {
			for (var i = 0; i < $scope.venta.length; i++) {
				$scope.venta[i].idTransaccion = $scope.nuevoId;
				$scope.addApuesta($scope.venta[i]);
			};

			$scope.getId();
		}
		}, function errorCallback(response) {
			if (angular.fromJson(response.data).status ==="ERROR") {
				alert(angular.fromJson(response.data).messages[0]);
			}
		
	});
}

$scope.getId = function(){
	$http({
		method: 'GET' , 
		url: 'phalcon/api/transaccion'
	}).then(function succesCallback(response) {
		$scope.nuevoId = response.data.length;
		console.log($scope.nuevoId);
		}, function errorCallback(response) {
			console.log(response.data);
		});
};

$scope.anadirTabla =function(){
	$scope.apuestas.fecha=new Date();
	$scope.apuestas.hora = $scope.apuestas.fecha.getMinutes();
	$scope.venta.push($scope.apuestas);
	$scope.data.total += parseInt($scope.apuestas.valorApuesta);
	$scope.apuestas = {};
}

$scope.getLoterias = function(){
	$http({
		method: 'GET' , 
		url: 'phalcon/api/loterias'
	}).then(function succesCallback(response) {
		$scope.loterias = response.data;
		}, function errorCallback(response) {
			console.log(response.data);
		});
};

$scope.getLoterias();
$scope.getId();
});

modController.controller('estadisticasCtrl' , function($scope , $http) {

	$scope.estadistica ={};
	var fecha = new Date();
	var fechaS = fecha.getFullYear() +'-'+(fecha.getMonth()+1)+'-'+ fecha.getUTCDate();
	console.log(fechaS);
	console.log(fecha);

	$scope.getTransacciones = function(){
	$http({
		method: 'GET' , 
		url: 'phalcon/api/apuestasd/'+ fechaS
	}).then(function succesCallback(response) {
		console.log(response.data);
		}, function errorCallback(response) {
			console.log(response.data);
		});
	};

	$scope.getTransacciones();
});


