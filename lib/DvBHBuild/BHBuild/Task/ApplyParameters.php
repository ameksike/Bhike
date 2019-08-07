<?php
	
	use Ksike\ksl\base\helpers\Assist;
	
	class BHBuild_Task_ApplyParameters extends BHBuild_Task
	{
		private $content;
		private $twig;
		
		public function __construct($content="",$parameters=array()) {
			$this->content = is_string($content) ? $content : "No content supplied!";
			$this->parameters = is_array($parameters) ? $parameters : array();
			$this->twig = Assist::driver("Twig");			
		}
		
		public function execute() {
			return $this->twig->tplString2Doc($this->content,$this->inyectParameters());
		}
		
		public function inyectParameters() {
			$data = array();
			foreach($this->parameters as $k=>$v) $data[strtolower($k)] = $v;
			return $data;
		}
		
		public function setContent($content) {
			$this->content = $content;
		}
	}
