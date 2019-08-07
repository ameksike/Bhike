<?php
	
	use Ksike\ksl\base\helpers\Assist;
	
	class BHBuild_Task_ResolveTemplates extends BHBuild_Task
	{
		protected $category;
		protected $location;
		protected $type;
		protected $treatErrorsAsWarnigns;
		private $tplRootName = "BHTemplate";
		
		public function __construct(){
			$this->category = "";
			$this->location = "";
			$this->type = "";
			$this->treatErrorsAsWarnigns = false;
		}		
		
		public function execute() {
			switch($this->category) {
				case "installed":
				default:
					return $this->getInstalledTemplates();
			}			
		}
		
		public function getInstalledTemplates() {
			$installed = array();
			$templates = Assist::package("dir")->scan($this->location . $this->type . "/","-i", $this);			
			foreach($templates["dir"] as $template)
				$installed[$template] = BHBuild_Executer::ResolveTemplate(array("location"=>$this->location,"type"=>$this->type,"template"=>$template));
			return $installed;
		}
		
		public function onFind($lst, $path, $params='',$item, $type='') {
			$this->content[] = $path.$item;
		}
		
		public function setCategory($category) {
			$this->category = $category;
		}
		
		public function setLocation($location) {
			$this->location = $location;
		}
		
		public function setType($type) {
			$this->type = $type;
		}
		
		public function setTreatErrorsAsWarnigns($treatErrorsAsWarnigns = false) {
			$this->treatErrorsAsWarnigns = $treatErrorsAsWarnigns;
		}
	}
?>
