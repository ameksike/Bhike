<?php

	class BHBuild_Model_Folder extends BHBuild_Model_Container
	{
		private $targetFolderName;
		
		public function __construct($name="",$targetFolderName="",$content=array()) { 
			parent::__construct($name,$targetFolderName,false,$content);
			$this->targetFolderName = is_string($targetFolderName) ? $targetFolderName : "";
		}
		
		public function deploy() {
			if($this->name) {
				try {
					$this->setName($this->getTargetFolderName());				
					parent::deploy();
				}
				catch(Exception $e) { throw $e; }
			}
			else throw new Exception("BHBuild_Model: 'Folder' says: 'No name specified. <<Folder Name value is required!!!>>'");			
		}
		
		public function getTargetFolderName() { return $this->targetFolderName != "" ? $this->targetFolderName : $this->name; }
		
		public function setTargetFolderName($targetFolderName) { if(is_string($targetFolderName)) $this->targetFolderName = $targetFolderName; }
	}
