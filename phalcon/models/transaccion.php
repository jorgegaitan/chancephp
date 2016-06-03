<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Message;
use Phalcon\Mvc\Model\Validator\Uniqueness;
use Phalcon\Mvc\Model\Validator\InclusionIn;


class transaccion extends Model{

	public function validation(){
		return true;

		if($this->validationHasFailed() == true){
			return false;
		}
	}
}

?>