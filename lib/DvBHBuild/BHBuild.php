<?php
	require 'BHBuild/Autoloader.php';
	ini_set('xdebug.max_nesting_level', 2000);
	
	class BHBuild extends BHBuild_Autoloader
	{
		public function __construct(){ self::register(); }
		
		public function __call($method,$args) {
			$build = new BHBuild_Build();
			if(method_exists ( $build , $method )) return call_user_func_array( array($build, $method), $args);
		}		
	}
