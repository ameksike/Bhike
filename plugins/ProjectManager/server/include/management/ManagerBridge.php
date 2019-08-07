<?php
	/*
	 * @name: ManagerBridge
	 * @type: Class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This interface defines all managers' methods.
	 * */
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class ManagerBridge
	{
		public static $config = array();
		
		public function __construct() {
			$this->loadConfig();
		}
		
		public static function __callStatic($method,$args) {
			self::loadConfig();
			$instance = self::instanciate($method,$args[0]);			
			return $instance;
		}
		
		public function __call($method, $args) {
			$manager = $this->getManager($args[0]);
			if(is_array($manager)) return $manager;
			if(method_exists ( $manager , $method )) return call_user_func_array( array($manager, $method), $args);
		}
		
		private function getManager($path="../../") {			
			$mtd = $this->getBHMetadata($path);			
			return $mtd['success'] ? $this->instanciate($mtd['data']['project']['data']['manager']) : $mtd;
		}
		
		public function instanciate($class,$params="") {			
			$class = isset($class) ? $class : self::$config['manager']['default']['classname'];			
			if(class_exists($class)) return new $class($params);
			else {				
				$path = Assist::router("module","ProjectManager").self::$config['managers']['location'];				
				$file = "$path$class/server/$class".KCL_EXT;
				if(file_exists($file)) { @include $file; if(class_exists($class)) return new $class($params); }
			}
			$class = self::$config['manager']['default']['classname'];
			return new $class($params);
		}
		
		private function getBHMetadata($path) {
			$result = array();
			$dir = $path . self::$config['metadata']['default']['foldername']."/";
			if( is_dir($dir) ) {
				$metadata = Assist::package("config")->load($dir, self::$config['metadata']['default']['filename']);
				if( $metadata==null || !isset($metadata['BHProject'])) return array('success'=>false,'msg'=>"Error while loading project metadata.");				
				$result['project']['data']['path'] = $path;
				$result['project']['data']['name'] = $metadata['BHProject']['ProjectData']['Name'];
				$result['project']['data']['manager'] = $metadata['BHProject']['@attributes']['Type'];
				$result['project']['data']['version'] = $metadata['BHProject']['@attributes']['Version'];
				//$result['project']['session'] = $metadata['BHProject']['SessionData'];
				return array('success'=>true,"data" => $result);
			}		
			return array('success'=>false,"msg"=>"not-found");
		}
		
		private function loadConfig(){
			self::$config = Assist::package("config")->load( Assist::router("module","ProjectManager")."cfg/" , "managers");
		}
	}
