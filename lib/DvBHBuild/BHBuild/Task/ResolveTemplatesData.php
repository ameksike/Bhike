<?php
	
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class BHBuild_Task_ResolveTemplatesData extends BHBuild_Task_ResolveTemplates
	{
		private $filters;		
		private $tplRootName = "TemplateData";
		
		public function __construct(){ parent::__construct();
			$this->filters = array();
		}		
		
		public function execute() {
			$templates = parent::execute();
			return $this->getTemplatesData($templates);
		}		
		
		private function getTemplatesData($templates) {
			$templatesData = array();
			foreach($templates as $template=>$content) { $filtered = $this->filter($content);				
				if($filtered) {
					$task = new BHBuild_Task_ResolveTemplateData($template,$this->location,$this->type);
					$tpl = $task->getData($filtered); $templatesData[$template] = $tpl;
				}
			}
			return $templatesData;
		}
		
		private function filter($content) {
			$templateData = $content[$this->tplRootName];
			if(!empty($this->filters))
				foreach($this->filters as $k=>$v) {					
					if(!array_key_exists($k,$templateData)) return false;
					else {
						$kdata = explode("/",$templateData[$k]);
						if(is_array($v)) {
							foreach($v as $sv)
								if($this->contained($sv,$kdata)) break 2;
							return false;
						}
						else if(!$this->contained($v,$kdata)) return false;						
					}
				}
			$data = array();
			foreach($content[$this->tplRootName] as $k=>$v) $data[$k] = $v;
			return $data;
		}
		
		private function contained($val,array $array) {
			return array_search($val,$array) !== FALSE;
		}
		
		public function onFind($lst, $path, $params='',$item, $type='') {
			$this->content[] = $path.$item;
		}
		
		public function setFilters(array $filters) {
			$this->filters = $filters;
		}
	}
?>
