<?php
use Ksike\ksl\filter\iface\Error;
class MyExeption implements Error
{
	public static function onCatch($error){
		if($error["cat"]=="exception"){
			echo "<br> exept: "; 
			print_r($error);
		}
	
	}
}
