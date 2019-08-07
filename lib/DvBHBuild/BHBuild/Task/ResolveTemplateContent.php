<?php
	
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class BHBuild_Task_ResolveTemplateContent extends BHBuild_Task_ResolveTemplate
	{	
		private $tplRootName = "TemplateContent";
		
		public function __construct($template="",$location="",$type="",$treatErrorsAsWarnigns=false){ 
			parent::__construct($template,$location,$type,$treatErrorsAsWarnigns);
		}
		
		public function execute() {
			try {
				return $this->extract(parent::getData());
			}catch(Exception $e) { throw $e; }
		}
		
		private function extract($tpl) {
			if(isset($tpl) && array_key_exists($this->tplRootName,$tpl)) {				
				return $tpl[$this->tplRootName];
			}
			else throw new Exception("Template: ".$this->template." has no content defined to deploy!!!");
		}		
	}
?>
