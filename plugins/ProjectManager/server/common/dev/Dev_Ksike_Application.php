<?php
	/*
	 * @name: KsikeApplication
	 * @type: class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This class  is used to manage all Ksike applications.
	 * */
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class Dev_Ksike_Application implements Dev_Container 
	{
		public static $content = array();
		public function __construct() { }
		
		public static function getContent($params){
			$response = array();
			/*$data = self::getMetadata($params->artifact,$params->path);
			$response["type"] = $data['@attributes']['type'];				
			$response["name"] = $data['info']['name'];*/
			$response["path"] = $params->path;
			Assist::package("dir")->scan($params->path, "-i", $this,"get-content");			
			$response["content"] = self::$content;
			return $response;
		}
		
		public function onFind($lst, $path, $params='',$item, $type='') {
			if($params == "get-content"){
				if($type == "dir") {
					switch($item) {						
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
					self::$content[$item] = array('artifact'=>'Item');
				}
			}
		}

		public function onCloseDir($lst, $path) {
			return $lst;
		}

	}
?>
