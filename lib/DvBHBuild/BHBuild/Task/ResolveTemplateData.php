<?php
	
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class BHBuild_Task_ResolveTemplateData extends BHBuild_Task_ResolveTemplate
	{	
		private $tplRootName = "TemplateData";
		public function __construct($template="",$location="",$type="",$treatErrorsAsWarnigns=false){ parent::__construct($template,$location,$type,$treatErrorsAsWarnigns);}
		
		public function getData() {
			$templateData = parent::getData();
			return $this->applyStyles($this->applyDefaults($templateData[$this->tplRootName]));			
		}
		
		public function applyStyles($template) {
			$icon_file = realpath($this->location.$this->type)."/".$this->template."/".$template["Icon"];
			if(array_key_exists("Icon",$template) && !is_array($template["Icon"]) && file_exists($icon_file))
				$template["Icon"] = "app/data/templates/".$this->type."/".$this->template."/".$template["Icon"];
			else $template["Icon"] = "plugins/ProjectManager/".Assist::package("config")->ProjectManager['default']['icon'];
			
			$preview_file = realpath($this->location.$this->type)."/".$this->template."/".$template["PreviewImage"];
			if(array_key_exists("PreviewImage",$template) && !is_array($template["PreviewImage"]) && file_exists($preview_file))
				$template["PreviewImage"] =  "app/data/templates/".$this->type."/".$this->template."/".$template["PreviewImage"];
			else $template["PreviewImage"] = $template["Icon"];
			
			$template["Location"] = realpath($this->location)."/";
			
			$this->extractRequiredFrameworkInfo($template);
			$this->extractLanguagesDropDownInfo($template);
			return $template;
		}
		
		public function applyDefaults($data,$params=array()) {			
			$this->extractRequiredFrameworkInfo($data);
			$this->extractLanguagesDropDownInfo($data);
			$file = Assist::router("module","Main")."data/templates/defaults/TemplateData.twig";
			$this->setParameters($data);
			if(file_exists($file)) {
				$result = parent::applyDefaults(file_get_contents($file));
				return $result[$this->tplRootName];
			}
			else return array('success'=>false,'msg'=>"DefaultTemplateData file was not found!!");
		}
		
		private function extractRequiredFrameworkInfo(array &$templateData) {
			if(array_key_exists("RequiredFramework",$templateData)) {
				$name = $templateData["RequiredFramework"]["@attributes"]["Name"];
				$alias = $templateData["RequiredFramework"]["@attributes"]["Alias"];
				$version = $templateData["RequiredFramework"]["@attributes"]["Version"];
				$templateData["RequiredFramework"] = array('name'=>$name,'version'=>$version,'alias'=>$alias);				
			}
		}
		
		private function extractLanguagesDropDownInfo(array &$templateData) {
			if(array_key_exists("LanguageDropDown",$templateData)) {
				$languages = explode("/",$templateData["LanguageDropDown"]["@attributes"]["Languages"]);
				$templateData["LanguageDropDown"] = array("languages"=>$languages);
			}			
		}		
	}
?>
