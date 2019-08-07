<?php
	
	class BHBuild_Task_CreateFileFromTemplate extends BHBuild_Task_CreateFile
	{
		protected $source;
		protected $destination;		
		
		public function __construct($source="",$destination="",$parameters=array()) {
			$info = pathinfo($destination);
			parent::__construct($info['dirname'],$info['basename']);			
			$this->source = is_string($source) ? $source : "";
			$this->destination = is_string($destination) ? $destination :"";
			$this->parameters = is_array($parameters) ? $parameters : array();
		}
		
		public function execute() {
			if(file_exists($this->source)) {
				$content = file_get_contents($this->source);				
				$applyParams = new BHBuild_Task_ApplyParameters($content,$this->parameters);
				$this->setContent($applyParams->execute());
				parent::execute();
			}
			else throw new Exception("BHBuild_Task: 'CreateFileFromTemplate' says: 'No source file found at: ".$this->source." <<Source path required!!!>>'");
		}
		
		public function setSource($source) {
			if(is_string($source)) $this->source = $source;
		}
		
		public function setDestination($destination) {
			if(is_string($destination)) $this->destination = $destination;		
		}
	}
