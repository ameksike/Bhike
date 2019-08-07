<?php

	/*
	 * @name: Ksike
	 * @type: class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This class  is used to manage all Ksike projects. Extends Default project.
	 * */	
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package; 
	
	class Dev_Project_Ksike extends Dev_Project_Default 
	{		
		private $app;
		private $plugins = array();
		private $config = array();
		private $dependencies = array();
		
		private static $artifacts_location = array("application"=>"application","plugin"=>"plugins");
		private static $config_location = array("Project"=>"core/cfg/","application"=>"cfg/","plugins"=>"cfg/");
		private static $metadata_location = array("Project"=>"core/metadata/","application"=>"","plugins"=>"");
		private static $metadata_filename = "metadata";		
		
		public function __construct($path="../../") {
			$metadata = self::getMetadata("Project",$path);
			parent::__construct($metadata['info'],$path);
			$this->tpl = $tpl;
			$this->config = self::getConfigLocation("Project",$this->path);
			$this->dependencies = $metadata['dependencies'];			
		}
		
		public function build(){
			
		}		
		
		public static function getConfig($artifact,$path){
			try{
				return Assist::package("config")->load($path.self::getConfigLocation($artifact),"config");
			} catch(Exception $e){ return $e; }
		}
		
		public static function getMetadata($artifact,$path){
			try{
				$data = Assist::package("config")->load($path.self::getMetadataLocation($artifact),self::$metadata_filename);
				return $data ? $data['metadata'] : false;
			}
			catch(Exception $e){ return $e; }
		}
		
		public static function getContent($params){
			$response = array();
			switch(strtolower($params->artifact)){
				case "application":
					return Dev_Ksike_Application::getContent($params);
				case "project":
					$data = self::getMetadata($params->artifact,$params->path);
					$response["type"] = $data['@attributes']['type'];				
					$response["name"] = $data['info']['name'];
				default:
					$response["path"] = $params->path;
					Assist::package("dir")->scan($params->path, "-i", $this,"get-content");			
					$response["content"] = self::$content;
					return $response;
					
			}			
		}
		
		private static function getConfigLocation($artifact="Project"){
			return self::$config_location[$artifact];
		}
		
		private static function getMetadataLocation($artifact="Project"){
			return self::$metadata_location[$artifact];
		}
		
		public function onFind($lst, $path, $params='',$item, $type='') {
			if($params == "get-content"){
				if($type == "dir") {
					switch($item) {
						case 'app':
							self::$content[$item] = array('artifact'=>'Application','container'=>true, 'icon'=>"app/data/templates/project/Ksike/icons/icon.png");
							break;
						case 'core':
							self::$content[$item] = array('artifact'=>'core','container'=>true, 'icon'=>"app/data/templates/project/Ksike/icons/core.png");
							break;
						case 'metadata':
							self::$content[$item] = array('artifact'=>'virtual','container'=>true, 'icon'=>"app/data/templates/project/Ksike/icons/metadata.png");
							break;
						case 'lib':
							self::$content[$item] = array('artifact'=>'lib_folder','container'=>true, 'icon'=>"app/data/templates/project/Ksike/icons/library.png");
							break;
						case 'cfg':
							self::$content[$item] = array('artifact'=>'cfg_folder','container'=>true, 'icon'=>"app/data/templates/project/Ksike/icons/cfg.png");
							break;
						case 'log':
							self::$content[$item] = array('artifact'=>'log_folder','container'=>true, 'icon'=>"app/data/templates/project/Ksike/icons/logs.png");
							break;
						case 'src':
							self::$content[$item] = array('artifact'=>'src_folder','container'=>true, 'icon'=>"app/data/templates/project/Ksike/icons/src_folder.png");
							break;
						default:
							self::$content[$item] = array('artifact'=>'Folder','container'=>true);
							break;
					}
				}
				else {
					switch($item){
						case 'index.php':
							self::$content[$item] = array('artifact'=>'CAP','icon'=>"app/data/templates/project/Ksike/icons/index.png");
							break;
						default:
							self::$content[$item] = array('artifact'=>'Item');
							break;
					}
				}
			}
		}
	}

?>
