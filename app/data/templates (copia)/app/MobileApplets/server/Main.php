<?php
	use Ksike\\filter\\control\\App;

	class {$GLOBALS['name']} extends App
	{
		public function holaMundo($params)
		{
			return array(
				'action'=>'holaMundo',
				'result'=>'hola '.$params->name
			);
		}
	}
?>
