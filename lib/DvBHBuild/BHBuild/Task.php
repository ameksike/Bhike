<?php
	abstract class BHBuild_Task implements BHBuild_ITask 
	{
		protected $parameters = array();
		
		public function execute(){}
		
		public function getParameters($param) {
			if(array_key_exists($param,$this->parameters))
				return $this->parameters[$param];
			return $this->parameters;
		}
		
		public function setParameters($parameters) {
			if(is_array($parameters)) $this->parameters = $parameters;
		}
	}
?>
