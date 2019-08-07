<?php
	
	class BHBuild_Model_ProjectItem extends BHBuild_Model_File
	{		
		private $openInEditor;
		private $openOrder;	
		
		public function __construct($source="",$name="",$targetFileName="",$replaceParameters=false,$openInEditor=false,$openOrder=100) {
			parent::__construct($source,$name,$targetFileName,$replaceParameters);
			$this->openOrder = is_numeric($openOrder) ? $openOrder : 100;
			$this->openInEditor = is_bool($openInEditor) ? $openInEditor : false;
		}
		
		public function deploy() {
			if($this->name) {
				try { parent::deploy(); }
				catch(Exception $e) { throw $e; }
			}
			else throw new Exception("BHBuild_Model: 'ProjectItem' says: 'No name specified. <<ProjectItem Name value is required!!!>>'");
		}
		
		public function getOpenOrder() { return $this->openOrder; }
		
		public function setOpenOrder($openOrder) { if(is_numeric($openOrder)) $this->openOrder = $openOrder; }
		
		public function getOpenInEditor() { return $this->openInEditor; }
		
		public function setCustomTool($openInEditor) { if(is_bool($openInEditor)) $this->openInEditor = $openInEditor; }		
		
	}
