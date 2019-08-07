<?php
	
	class BHBuild_Task_MakeDir extends BHBuild_Task
	{
		protected $path;
		protected $name;
		
		public function __construct($path,$name){
			$this->path = is_string($path) ? $path : "";
			$this->name = is_string($name) ? $name : "New Empty Folder";
		}
		
		public function execute() {
			if(is_dir($this->path))
				return mkdir(realpath($this->path)."/".$this->name,0777);
			else
				return $this->forceMake($this->path."/".$this->name);
		}
		
		private function forceMake($path) {
			if(is_string($path)) {
				$short = pathinfo($path);
				if(!is_dir($short['dirname'])){
					$this->forceMake($short['dirname']);
					return mkdir(realpath($short['dirname'])."/".$short['basename'],0777);
				}
				else return mkdir(realpath($short['dirname'])."/".$short['basename'],0777); 
			}
			else throw new Exception("Invalid path supplied.");
		}
		
		public function setName($name) {
			if(is_string($name)) $this->name = $name;
		}
		
		public function setPath($path) {
			if(is_string($path)) $this->path = $path;		
		}		
	}
