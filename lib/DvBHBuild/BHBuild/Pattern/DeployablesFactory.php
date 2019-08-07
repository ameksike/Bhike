<?php
	
	class BHBuild_Pattern_DeployablesFactory
	{		
		
		public static function __callStatic($class,$args) {
			if(is_array($args[0])) {
				$instance = BHBuild_Pattern_Builder::$class();
				if($instance) {					
					return self::factoryze($instance,$args[0]);
				}				
			}
		}
		
		public static function factoryze(BHBuild_Model_IDeployable &$instance, array $args = array() ) {			
			if(!empty($args)) {
				foreach($args as $k=>$v) { 
					$method = "set".ucfirst($k);
					if(isset($v) && method_exists($instance,$method)) $instance->$method($v);
				}
				return $instance;
			}
			return false;
		}
		
	}
