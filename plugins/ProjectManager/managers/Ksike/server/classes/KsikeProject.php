<?php
	/*
	 * @name: KsikeProject
	 * @type: class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This class  is used to instanciate every Ksike projects. Extends Default project.
	 * */
	
	use Ksike\ksl\base\helpers\Assist;
	
	class KsikeProject extends KsikeContainer
	{
		private $app;
		private $plugins = array();
		
		public function __construct($location="project/",$mtd_location="core/mtd/") { 
				parent::__construct($location,$mtd_location);		
				
			$schema = $this->getSchema();
			if(isset($schema)) {
				$this->app = new KsikeApplication($this->location.$schema['router']['app']['@attributes']['value']);
				//$this->extractModules();
			}
		}
		
		private function extractModules() {
			$schema = $this->getSchema();
			if(isset($schema['router']['plugins'])) {
				if($schema['router']['plugins']['@attributes']['type'] == "collection") {
					$mdsPath = explode("|",$schema['router']['plugins']['@attributes']['value']);
					foreach($mdsPath as $path) {						
						$sys = Assist::package("dir")->scan($this->location.$path, "-i", $this);					
						foreach($sys['dir'] as $dir) {
							$this->plugins[] = new KsikeModule($this->location.$path."$dir/");
						}
					}
				}
			}
		}
		
		public function getModules() {
			return $this->plugins;
		}
		
		public function getModule($module) {
			$schema = $this->getSchema();
			if(isset($schema['router']['plugins']))
				if($schema['router']['plugins']['@attributes']['type'] == "collection") {
					$mdsPath = explode("|",$schema['router']['plugins']['@attributes']['value']);
					foreach($mdsPath as $path) {						
						$sys = Assist::package("dir")->find($module,$this->location.$path, "sstrict", "-r");					
						foreach($sys['dir'] as $dir) if($dir == $module) return new KsikeModule($this->location.$path."$dir/");						
					}
				}
		}
		
		public function removeItems($files,$deletedFiles) {
			foreach($files as $f) {				
				$cmp = $this->getComponent($this->location.$f."/");
				$cmp instanceof KsikeProject ? parent::removeItems($f,$deletedFiles) : $cmp->removeItems($f,$deletedFiles);
			}		
		}
		
		public function getItems($path) {
			$cmp = $this->getComponent($path);
			return $cmp instanceof KsikeProject ? parent::getItems($path) : $cmp->getItems($path);
		}
		
		private function getComponent($branch) {
			$cmp = array();			
			if( isset($branch) && $branch != "") {
				$schema = $this->getSchema();
				foreach($schema['router'] as $s=>$v) if($s != '@attributes') {
					if(isset($v['@attributes']['type']) && $v['@attributes']['type'] == "collection") {						
						$values = explode("|",$v['@attributes']['value']);
						foreach($values as $v)
							if(strpos($branch, $v) !== false) {
								$cmp['key'] = $s; $cmp['val'] = $v; break 2;
							}						
					}
					else if(strpos($branch, $v['@attributes']['value']) !== false ) {
						$cmp['key'] = $s; $cmp['val'] = $v['@attributes']['value']; break;
					}
				}
			}
						
			switch($cmp['key']) {
				case 'app':
					return $this->app;
				case 'plugins':
					$p = explode("/",str_replace($cmp['val'],"",$branch));
					if($p[0] != "") {
						$plugin = $this->getModule($p[0]);
						return $plugin;
					}
				default:
					return $this;
			}
			
		}
		/*public function getDescription(){
			return "WAKALA!!!";
		}*/
	}
