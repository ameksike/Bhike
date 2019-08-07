<?php
	
	class BHBuild_Task_CreateFile extends BHBuild_Task
	{
		protected $path;
		protected $content;
		protected $name;
		
		public function __construct($path="",$name="",$content="Empty File"){
			$this->path = is_string($path) ? $path : "";
			$this->content = is_string($content) ? $content :"Empty File";
			$this->name = is_string($name) ? $name : "New Empty Document";
		}
		
		public function execute() {
			if(is_dir($this->path)) { 
				return file_put_contents(realpath($this->path)."/".$this->name,$this->content); 
			}
			else throw new Exception("Invalid path supplied.");
		}
		
		public function setName($name) {
			if(is_string($name)) $this->name = $name;
		}
		
		public function setPath($path) {
			if(is_string($path)) $this->path = $path;		
		}
		
		public function setContent($content) {
			if(is_string($content)) $this->content = $content;
		}
	}
