<?php
	use Ksike\ksl\filter\control\App; 
	use Ksike\ksl\base\helpers\Assist;
	class Main extends App 
	{
		public function index($params)
		{
			$path = Assist::router("this");
			$file = $path."client/html/view.html";	
			return file_get_contents($file);
		}
		
		public function loadSettings($params){
			$path = Assist::router("this")."cfg/";
			$config = Assist::package("config")->load($path, "config");
			return array('settings' => $config['settings']);
		}
	}
?>
