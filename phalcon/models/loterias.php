<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Message;
use Phalcon\Mvc\Model\Validator\Uniqueness;
use Phalcon\Mvc\Model\Validator\InclusionIn;


class loterias extends Model{

	public function validation(){
		$this->validate(
			new Uniqueness(
				array(
						"field" => "nombre",
						"message" => "el nombre es unico"
					)
				)
			);

		if($this->validationHasFailed() == true){
			return false;
		}
	}
}

?>