<?php
	
	use Ksike\ksl\base\helpers\Assist;
	
	class BHBuild_Task_ResolveTemplate extends BHBuild_Task
	{	
		protected $location;
		protected $template;
		protected $type;
		protected $treatErrorsAsWarnigns;	
		private $tplRootName = "BHTemplate";
		
		public function __construct($template="",$location="",$type="",$treatErrorsAsWarnigns=false) {
			$this->template = $template;
			$this->location = $location;
			$this->type = $type;
			$this->treatErrorsAsWarnigns = $treatErrorsAsWarnigns;
		}		
		
		public function execute() {
			return $this->getData();
		}
		
		public function getData() {
			try {
				$template = realpath($this->location.$this->type)."/".$this->template."/".$this->template.".xml";
				if(file_exists($template)) {
					$content = self::applyDefaults(file_get_contents($template));
				}
				else return array('success'=>false,'msg'=>"Template: ".$this->template." not found in: ".$this->location.$this->type."!!!");
			}
			catch(Exception $e) { throw $e; }
			return (isset($content) && $this->isValid($content)) ? $content[$this->tplRootName] : false;
		}
		
		public function applyDefaults($content) {
			$out = BHBuild_Executer::ApplyParameters(array("parameters"=>$this->parameters,"content"=>$content));
			$xml = Assist::driver("XML");
			$result = $xml->toArray($out);
			return $result;
		}
		
		private function isValid($tplContent) {
			return isset($tplContent) && array_key_exists($this->tplRootName,$tplContent);				
		}
		
		public function onFind($lst, $path, $params='',$item, $type='') {
			$this->content[] = $path.$item;
		}
				
		public function setLocation($location) {
			if(is_string($location)) $this->location = $location;
		}
		
		public function setType($type) {
			if(is_string($type)) $this->type = $type;
		}
		
		public function setTemplate($template) {
			if(is_string($template)) $this->template = $template;
		}
		
		public function setTreatErrorsAsWarnigns($treatErrorsAsWarnigns = false) {
			$this->treatErrorsAsWarnigns = $treatErrorsAsWarnigns;
		}		
	}
?>
