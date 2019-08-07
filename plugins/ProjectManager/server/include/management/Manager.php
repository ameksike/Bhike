<?php
	/*
	 * @name: Manager
	 * @type: Class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This interface defines all managers' methods.
	 * */
	use Ksike\ksl\base\patterns\Singleton;
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class Manager extends Singleton implements IManagable//, Singleton
	{
		protected $content = array();
		private $bhbuild;
		protected $mtd_info;
		public function __construct() {
			$this->bhbuild = Assist::driver("BHBuild");
			$this->mtd_info = Assist::package("config")->load( Assist::router("module","ProjectManager")."cfg/" , "managers");
		}
		
		public function buildComponent($template,$params) {
			try {
				return $this->bhbuild->deployTemplateContent($params['location'],$template->location,$template->type,$template->name,$params);
			}catch(Exception $e) { throw $e; }
		}
		
		public function removeItems($location="../",$files,$deletedFiles) {
			$toDelete = array();
			if(!empty($files)) foreach($files as $f) $toDelete[] = $location.$f;
			else $toDelete[] = $location;
			return $this->bhbuild->deleteFiles($toDelete,$deletedFiles);
		}
		
		public function getMetadata($path) {			
			$result = array();
			$dir = $path . $this->mtd_info['metadata']['default']['foldername']."/";
			if( is_dir($dir) ) {
				$metadata = Assist::package("config")->load($dir, $this->mtd_info['metadata']['default']['filename']);
				if( $metadata == null || !isset($metadata['BHProject'])) {
					
					return array('success'=>false,'msg'=>"Error while loading project metadata.");
				}
				$result['project']['data']['path'] = $path;
				$result['project']['data']['name'] = $metadata['BHProject']['ProjectData']['Name'];
				$result['project']['data']['manager'] = $metadata['BHProject']['@attributes']['Type'];
				$result['project']['data']['version'] = $metadata['BHProject']['@attributes']['Version'];
				//$result['project']['session'] = $metadata['BHProject']['SessionData'];
				return array('success'=>true,"data" => $result);
			}		
			return array('success'=>false,"msg"=>"not-found");
		}
		
		public function getItems($location,$branch) {
			Assist::package("dir")->scan($location.$branch, "-i", $this,"get-content");			
			$response["content"] = $this->content;
			return $response;
		}
		
		public function getProjectIcon($project) {
			return "plugins/ProjectManager/client/img/defaults/icons/bhproject.png";
		}
		
		public function getProjectDescription ($project="It"){
			return "$project has no description.";
		}
		
		public function onFind($lst, $path, $params='',$item, $type='') {
			if($params == 'get-content'){
				if($type == "dir") {
					switch($item) {
						default:
							$this->content[$item] = array('artifact'=>'Folder','container'=>true);
							break;
					}
				}
				else $this->content[$item] = array('artifact'=>"File");//mime_content_type($path.$item));
			}
		}

		public function onCloseDir($lst, $path) {
			return $lst;
		}
	}
