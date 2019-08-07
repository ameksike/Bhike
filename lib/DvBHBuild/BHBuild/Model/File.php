<?php

	abstract class BHBuild_Model_File extends BHBuild_Model_Item
	{			
		protected $targetFileName;		
		
		public function __construct($source="",$name="",$targetFileName="",$replaceParameters=false) {
			parent::__construct($name,$targetFileName,$replaceParameters);
			$this->source = is_string($source) ? $source : "";
			$this->targetFileName = is_string($targetFileName) ? $targetFileName : "";
		}
		
		public function deploy() {
			$name = $this->getTargetFileName();
			$this->setName($name);
			try {
				if($this->replaceParameters) {
					$createFFTPL = new BHBuild_Task_CreateFileFromTemplate($this->getSource(),$this->path.$name,$this->getParameters());
					$createFFTPL->execute();
				}
				else {
					$copy = new BHBuild_Task_Copy(array($this->source),array($this->path.$name));
					return $copy->execute();
				}
			}
			catch(Exception $e) { throw $e; }
		}	
		
		public function getTargetFileName() { return $this->targetFileName != "" ? $this->targetFileName : $this->name; }
		
		public function setTargetFileName($targetFileName) { if(is_string($targetFileName)) $this->targetFileName = $targetFileName; }
	}
