<?php
	/*
	 * @name: KsikeContainer
	 * @type: class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This class  is used to instanciate every Ksike projects.
	 * */
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	abstract class KsikeContainer extends EasilyAccessible
	{
		protected $location;
		protected $mtd_location;
		protected $content = array();
		protected $dependencies = array();
		protected $bhbuild;
		
		public function __construct($location,$mtd_location) {
			$this->bhbuild = Assist::driver("BHBuild");
			$this->location = $location;
			$this->mtd_location = $mtd_location;
			$metadata = $this->getMetadata();
			if(isset($metadata) &&  count($metadata) > 0 /*&& ( ($this instanceof KsikeProject && strtolower($metadata["@attributes"]["type"]) == "project") || ($this instanceof KsikeApplication && strtolower($metadata["@attributes"]["type"]) == "application") || ($this instanceof KsikeModule && strtolower($metadata["@attributes"]["type"]) == "module" ) ) */) 
				foreach($metadata['info'] as $field=>$value) $this->$field = $value;		
		}
		
		public function getItems($branch) {
			Assist::package("dir")->scan($this->location.$branch, "-i", $this,"get-content");			
			$response["content"] = $this->content;
			return $response;
		}
		
		public function removeItems($f,$deletedFiles) {
			$toDelete = array();
			$toDelete[] = $this->location.$f;
			return $this->bhbuild->deleteFiles($toDelete,$deletedFiles);
		}
		
		public function getMetadata() {
			try {
				$fullPath = $this->location.$this->mtd_location;
				if(is_dir($fullPath)) {
					$data = Assist::package("config")->load($fullPath,"metadata");
					return $data ? $data['metadata'] : false;
				}
			}
			catch(Exception $e){ return $e; }
		}
		
		public function getSchema() {
			try {
				$fullPath = $this->location.$this->mtd_location;
				if(is_dir($fullPath)) {
					$data = Assist::package("config")->load($fullPath,"schema");
					return $data ? $data['schema'] : false;
				}
			}
			catch(Exception $e){ return $e; }
		}
		
		
					
		public function onFind($lst, $path, $params='',$item, $type='') {
			if($params == "get-content"){
				if($type == "dir") {
					switch($item) {
						case 'app':
							$this->content[$item] = array('artifact'=>'Application','container'=>true, 'icon'=>"plugins/ProjectManager/managers/Ksike/client/img/icons/icon.png");
							break;
						case 'core':
							$this->content[$item] = array('artifact'=>'core','container'=>true, 'icon'=>"plugins/ProjectManager/managers/Ksike/client/img/icons/core.png");
							break;
						case 'mtd':
							$this->content[$item] = array('artifact'=>'virtual','container'=>true, 'icon'=>"plugins/ProjectManager/managers/Ksike/client/img/icons/metadata.png");
							break;
						case 'lib':
							$this->content[$item] = array('artifact'=>'lib_folder','container'=>true, 'icon'=>"plugins/ProjectManager/managers/Ksike/client/img/icons/library.png");
							break;
						case 'cfg':
							$this->content[$item] = array('artifact'=>'cfg_folder','container'=>true, 'icon'=>"plugins/ProjectManager/managers/Ksike/client/img/icons/cfg.png");
							break;
						case 'log':
							$this->content[$item] = array('artifact'=>'log_folder','container'=>true, 'icon'=>"plugins/ProjectManager/managers/Ksike/client/img/icons/logs.png");
							break;
						case 'src':
							$this->content[$item] = array('artifact'=>'src_folder','container'=>true, 'icon'=>"plugins/ProjectManager/managers/Ksike/client/img/icons/src_folder.png");
							break;
						default:
							$this->content[$item] = array('artifact'=>'Folder','container'=>true);
							break;
					}
				}
				else {
					switch($item){
						case 'index.php':
							$this->content[$item] = array('artifact'=>'File','icon'=>"plugins/ProjectManager/managers/Ksike/client/img/icons/index.png");
							break;
						default:
							$this->content[$item] = array('artifact'=>'File');
							break;
					}
				}
			}
		}
	}
