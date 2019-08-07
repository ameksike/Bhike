<?php
	class {$GLOBALS['name']} extends App
	{
		public function __construct() {
			parent::__construct();
		}

		public function holaMundo($params)
		{
			return array(
				'action'=>'holaMundo',
				'result'=>'hola '.$params->name
			);
		}
	}
?>
