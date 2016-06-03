<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Message;
use Phalcon\Mvc\Model\Validator\Uniqueness;
use Phalcon\Mvc\Model\Validator\InclusionIn;


class venta extends Model{

	public function validation(){
		$this->validate(
			new Uniqueness(
				array(
						"field" => "",
						"message" => ""
					)
				)
			);

		if($this->validationHasFailed() == true){
			return false;
		}
	}
}

?>