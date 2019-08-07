<?php
	
	class BHBuild_Pattern_Builder
	{
		public static function __callStatic($class,$args) {
			return isset($class) && class_exists($class) ? new $class($args) : false;
		}
		
		public function __call($class,$args) {
			return isset($class) && class_exists($class) ? new $class($args) : false;
		}
	}
