<?php
use Ksike\ksl\filter\iface\Error;
class MyError implements Error
{
	public static function onCatch($error){
		echo "<pre>"; print_r($error);
	}
}
