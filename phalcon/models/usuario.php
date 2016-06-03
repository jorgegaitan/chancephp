<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Message;
use Phalcon\Mvc\Model\Validator\Uniqueness;
use Phalcon\Mvc\Model\Validator\InclusionIn;


class usuario extends Model{

	public function validation(){
		$this->validate(
			new Uniqueness(
				array(
						"field" => "cedula",
						"message" => "la ceduula es unica"
					)
				)
			);

		if($this->validationHasFailed() == true){
			return false;
		}
	}
}

?>