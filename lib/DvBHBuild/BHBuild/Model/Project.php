<?php

	class BHBuild_Model_Project extends BHBuild_Model_Container
	{
		private $targetFileName;
		
		public function __construct($file="",$targetFileName="",$replaceParameters=false,$content=array()) { 
			parent::__construct($file,$targetFileName,$replaceParameters,$content);
			$this->targetFileName = is_string($targetFileName) ? $targetFileName : "";
		}
		
		public function deploy() {
			if($this->name) {
				try {
					$name = $this->getTargetFileName();
					array_unshift($this->content,new BHBuild_Model_ProjectItem("source",$this->name,$name,$this->replaceParameters));
					$this->setName($this->getParameters("safename"));
					parent::deploy();				
				} 
				catch(Exception $e) { throw $e; }
			}
			else throw new Exception("BHBuild_Model: 'Project' says: 'No file specified. <<Project File value is required!!!>>'");
		}
		
		public function getFile() { return $this->getName(); }
		
		public function setFile($file) { if(is_string($file)) return $this->setName($file); }
		
		public function getTargetFileName() { return $this->targetFileName != "" ? $this->targetFileName : $this->name; }
		
		public function setTargetFileName($targetFileName) { if(is_string($targetFileName)) $this->targetFileName = $targetFileName; }
	}
