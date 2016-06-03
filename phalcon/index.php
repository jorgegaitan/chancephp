<?php

error_reporting(E_ALL);

use Phalcon\Loader;
use Phalcon\Mvc\Micro;
use Phalcon\Di\FactoryDefault;
use Phalcon\Db\Adapter\Pdo\Mysql as PdoMysql;
use Phalcon\Http\Response;

$app = new Micro();
$loader = new Loader();
$loader->registerDirs(
	array(
		__DIR__ . '/models/'
		)
	)->register();


$di = new FactoryDefault();

$di->set('db', function(){

	return new PdoMysql(
		array(
			"host" => "localhost",
			"username" => "root",
			"password" => "",
			"dbname" => "proyectofinal"
			)
		);


});

//Usuarios

$app->setDI($di);
//obtiene una lista con todas las ventas de la bd
$app->get('/api/apuestas', function() use ($app) {
	$phql ="SELECT * FROM apuestas ORDER BY tipoApuesta";

	$apuestas = $app->modelsManager->executeQuery($phql);
	$data = array();

	foreach ($apuestas as $apuesta) {
		$data[] = array(
			'id' => $apuesta->id,
			'fecha' => $apuesta->fecha,
			'hora' => $apuesta->hora,
			'idLoteria' => $apuesta ->idLoteria,
			'tipoApuesta' => $apuesta->tipoApuesta,
			'valorApuesta' => $apuesta->valorApuesta,
			'premio' => $apuesta->premio
			);
	}

	echo json_encode($data);

});

$app->get('/api/apuestasd/{fechaAtributo}', function($fechaAtributo) use ($app) {
	$phql ="SELECT * FROM apuestas WHERE :fechaAtributo: = fecha";

	$apuestas = $app->modelsManager->executeQuery($phql,array(
			'fechaAtributo'=> $fechaAtributo
			));
	$data = array();

	foreach ($apuestas as $apuesta) {
		$data[] = array(
			'id' => $apuesta->id,
			'fecha' => $apuesta->fecha,
			'hora' => $apuesta->hora,
			'idLoteria' => $apuesta ->idLoteria,
			'tipoApuesta' => $apuesta->tipoApuesta,
			'valorApuesta' => $apuesta->valorApuesta,
			'premio' => $apuesta->premio
			);
	}

	echo json_encode($data);

});


//obtiene una lista con todas las transacciones
$app->get('/api/transaccion', function() use ($app) {
	$phql ="SELECT * FROM transaccion";

	$transacciones = $app->modelsManager->executeQuery($phql);
	$data = array();

	foreach ($transacciones as $transaccion) {
		$data[] = array(
			'id' => $transaccion->id,
			'idVentedor' => $transaccion->idVendedor,
			'costoTotal' => $transaccion->costoTotal
			);
	}

	echo json_encode($data);

});



//obtiene una lista con todas las loterias de la bd
$app->get('/api/loterias', function() use ($app) {
	$phql ="SELECT * FROM loterias ORDER BY nombre";

	$loterias = $app->modelsManager->executeQuery($phql);
	$data = array();

	foreach ($loterias as $loteria) {
		$data[] = array(
			'id' => $loteria->id,
			'nombre' => $loteria->nombre,
			'tipoSerie' => $loteria->tipoSerie
			);
	}

	echo json_encode($data);

});
//busca una venta por numero
$app->get('/api/venta/search/{numero}', function($numero) use ($app) {
	$phql ="SELECT * FROM venta  WHERE numero LIKE :numero: ORDER BY numero";

	$venta = $app->modelsManager->executeQuery($phql,
		array(
			'numero'=> '%'.$numero.'%'
			)
		);
	$data = array();

	foreach ($venta as $ventas) {
		$data[] = array(
			'id' => $ventas->id,
			'valor' => $ventas->valor,
			'numero' => $ventas->numero,
			'serie' => $ventas->serie
			);
	}

	echo json_encode($data);
});

//busca una venta por el id dado
$app->get('/api/venta/{id:[0-9]+}', function($id) use ($app) {
	$phql ="SELECT * FROM venta  WHERE id = :id: ";


	$ventas = $app->modelsManager->executeQuery($phql,
		array(
			'id'=> $id
			)	
		)->getFirst();

	$response = new Response();

	if($ventas == false){
		$response->setJsonContent(
			array(
				'status' => 'NOT-FOUND'
				)
			);


		}else{
			$response->setJsonContent(
			array(
				'status' => 'FOUND',
				'data' => array(
					'id' => $ventas->id,
					'valor' => $ventas->valor,
					'numero' => $ventas->numero,
					'serie' => $ventas->serie
					)

				)
			);
		}
		return $response;
});

//Agrega una apuesta via POST con  JSON
$app->post('/api/apuestas', function() use ($app) {
	$apuesta = $app->request->getJsonRawBody();

	$phql = "INSERT INTO apuestas(fecha,hora,idLoteria,tipoApuesta,valorApuesta,premio,idTransaccion) values
	(:fecha:,:hora:,:idLoteria:,:tipoApuesta:,:valorApuesta:,:premio:,:idTransaccion:)";
	$status = $app->modelsManager->executeQuery($phql, array(
		'fecha' => $apuesta->fecha,
		'hora' => $apuesta->hora,
		'idLoteria' =>$apuesta ->idLoteria,
		'tipoApuesta' => $apuesta->tipoApuesta,
		'valorApuesta' => $apuesta->valorApuesta,
		'premio' => $apuesta->premio,
		'idTransaccion' =>$apuesta->idTransaccion
		)
	);

	$response = new Response();

	if($status->success() == true){
		$response->setJsonContent(array('status' => 'OK'));
	}else{
		$response->setStatusCode(409,"Conflict");
		$errors = array();
		foreach ($status->getMessages() as $message) {
			$errors[] = $message->getMessage();
		}

		$response->setJsonContent(array(
				'status' => 'ERROR',
				'messages' => $errors
				)
			);
	}
	return $response;


});

//Agrega una transaccion via post 
$app->post('/api/transaccion', function() use ($app) {
	$transaccion = $app->request->getJsonRawBody();

	$phql = "INSERT INTO transaccion(id,idVendedor,costoTotal) values(:id:,:idVendedor:,:costoTotal:)";
	$status = $app->modelsManager->executeQuery($phql, array(
		'id' => $transaccion ->id,
		'idVendedor' => $transaccion->idVendedor,
		'costoTotal' => $transaccion->costoTotal
		)
	);

	$response = new Response();

	if($status->success() == true){
		$response->setJsonContent(array('status' => 'OK'));
	}else{
		$response->setStatusCode(409,"Conflict");
		$errors = array();
		foreach ($status->getMessages() as $message) {
			$errors[] = $message->getMessage();
		}

		$response->setJsonContent(array(
				'status' => 'ERROR',
				'messages' => $errors
				)
			);
	}
	return $response;


});

//Actualiza una basado por el id de la venta
$app->put('/api/venta/{id:[0-9]+}', function($id) use ($app) {
	$ventas = $app->request->getJsonRawBody();

	$phql = "UPDATE venta SET valor = :valor:, numero = :numero:, serie = :serie: WHERE id=:id:";
	$status = $app->modelsManager->executeQuery($phql, array(
		'id' => $id,
		'valor' => $ventas->valor,
		'numero' => $ventas->numero,
		'serie' => $ventas->serie
		)
	);

	$response = new Response();

	if($status->success() == true){
		$response->setJsonContent(array('status' => 'OK'));
	}else{
		$response->setStatusCode(409,"Conflict");
		$errors = array();
		foreach ($status->getMessages() as $message) {
			$errores[] = $message->getMessage();
		}

		$response->setJsonContent(array(
				'status' => 'ERROR',
				'messages' => $errors
				)
			);
	}
	return $response;


});

//elimina una venta basada por el id de la venta
$app->delete('/api/venta/{id:[0-9]+}', function($id) use ($app) {

	$phql = "DELETE FROM venta WHERE id = :id:";

	$status = $app->modelsManager->executeQuery($phql,array('id'=> $id ));

	$response = new Response();

	if($status->success() == true){
		$response->setJsonContent(array('status' => 'OK'));
	}else{
		$response->setStatusCode(409,"Conflict");
		$errors = array();
		foreach ($status->getMessages() as $message) {
			$errores[] = $message->getMessage();
		}
		$response->setJsonContent(array(
				'status' => 'ERROR',
				'messages' => $errors
				)
			);
	}
	return $response;

});


$app->handle();

?>