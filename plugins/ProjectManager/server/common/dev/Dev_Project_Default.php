<?php
	/*
	 * @name: Project
	 * @type: class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This class  is used to manage all projects by default.
	 * */
	use Ksike\ksl\base\helpers\Assist;
	
	class Dev_Project_Default implements Dev_Container 
	{
		protected $path;
		protected static $content = array();
		
		public function __construct($metadata=array(), $path="/") {
			$this->path = $path;
			if(isset($metadata)) foreach($metadata as $meta=>$value) $this->$meta = $value;
		}
		
		public function build($params){	}
		
		public static function getContent($params) {
			$response = array("path"=>$params->path);
			Assist::package("dir")->scan($params->path, "-i", $this,"get-content");			
			$response["content"] = self::$content;
			return $response;
		}
		
		public function __call($method, $args){	 
			$methodType = substr($method, 0, 3);
			$attribName = substr($method, 3);	 
			if(strtolower($methodType) == "set" ){
				$this->setAttrib($attribName, $args[0]);
			}
			
			if( strtolower($methodType) == "get" ){
				return $this->getAttrib($attribName);
			}
		}
		 
		private function setAttrib($attribName, $value){
			$attrib = strtolower($attribName);
			$this->$attrib = $value;
		}

		private function getAttrib($attribName){
			$attrib = strtolower($attribName);
			return $this->$attrib;
		}
		
		public function onFind($lst, $path, $params='',$item, $type='') {
			if($params == 'get-content'){
				if($type == "dir") {
					switch($item) {
						default:
							self::$content[$item] = array('artifact'=>'Folder','container'=>true);
							break;
					}
				}
				else self::$content[$item] = array('artifact'=>'File');
			}
		}

		public function onCloseDir($lst, $path) {
			return $lst;
		}
	}
?>
