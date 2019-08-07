<?php
	
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class BHBuild_Task_DeployTemplateContent extends BHBuild_Task
	{	
		private $destination;
		private $templateLocation;
		private $templateName;
		private $templateType;
		
		public function __construct($destination="",$templateLocation="",$templateType="",$templateName="",$parameters=array() ) {
			$this->destination = is_string($destination) ? $destination : "";
			$this->templateLocation = is_string($templateLocation) ? $templateLocation : "";
			$this->templateName = is_string($templateName) ? $templateName : "";
			$this->templateType = is_string($templateType) ? strtolower($templateType) : "";
			$this->parameters = is_array($parameters) ? $parameters : array();
		}
		
		public function execute() {
			$resolveTC = new BHBuild_Task_ResolveTemplateContent($this->templateName,$this->templateLocation,$this->templateType);
			$resolveTC->setParameters($this->parameters);
			return $this->deploy($this->goDeep($resolveTC->execute()));			
		}	
		
		public function deploy($tplContent) {			
			if(is_array($tplContent) && !empty($tplContent)) {				
				if(is_dir($this->destination)) {
					try {
						foreach($tplContent as $deployable)
							if($deployable instanceof BHBuild_Model_IDeployable) {
								if($deployable instanceof BHBuild_Model_File)
									$deployable->setPath($this->destination.$deployable->getTargetFileName());
								else									
									$deployable->setPath($this->destination);
																
								$deployable->setParameters($this->parameters);
								$deployable->setSource(realpath($this->templateLocation.$this->templateType)."/".$this->templateName);
								$deployable->deploy();
							}
					}
					catch(Exception $e) { throw $e; }
					return true;
				}
				else throw new Exception("BHBuild_Task: 'DeployTemplateContent' says: 'Invalid destination. <<Deployment destination Required!!!>>'");
			}
			//else throw new Exception("BHBuild_Task: 'DeployTemplateContent' says: 'Invalid destination. <<Deployment destination Required!!!>>'");
		}
		
		private function goDeep($root) {
			$collection = array();
			foreach($root as $name=>$value) {
				$classname = "BHBuild_Model_$name";
				try {
					$deployable = BHBuild_Pattern_Builder::$classname();
				}catch(Exception $e) { throw $e;}
				if($deployable instanceof BHBuild_Model_IContainable) {
					/*
					 * Aqui hay que pulir unos detalles correspondientes al filtrado del xml.
					 * Si un contenedor no tiene atributos (QUE ESTA INCORRECTO) el sistema va directo a 
					 * trabajar con su contenido. REVISAR CON CALMA LUEGO!!!
					 * */
					if(array_key_exists("@attributes",$value))
						$collection[] = $this->factoryzeContainer($deployable,$value);
					else if(!empty($value)) {
						foreach($value as $v) 
							$collection[] = $this->factoryzeContainer(BHBuild_Pattern_Builder::$classname(),$v);
					}
					else {
						throw new Exception("BHBuild_Task: 'DeployTemplateContent' says: 'No attributes defined for $name in template: ".$this->template."!!!'");
					}
				}
				else {
					if(array_key_exists("@attributes",$value)) 
						$collection[] = BHBuild_Pattern_DeployablesFactory::factoryze($deployable,$value["@attributes"]);
					else
						foreach($value as $v) 
							$collection[] = BHBuild_Pattern_DeployablesFactory::$classname($v["@attributes"]);					
				}
			}
			return $collection;
		}
		
		private function factoryzeContainer($deployable,$value) {
			if(empty($value)) {
				throw new Exception("BHBuild_Task: 'DeployTemplateContent' says: 'No attributes defined in template: ".$this->template."!!!'");
			}
			else {
				$attribs = array();
				$leaves = array();
				foreach($value as $k=>$v) 
					if($k == "@attributes") $attribs = $v; 
					else $leaves[$k] = $v;
				if(empty($leaves))
					return BHBuild_Pattern_DeployablesFactory::factoryze($deployable,$attribs);
				else {
					$params = array_merge(array('Content'=>$this->goDeep($leaves)),$attribs);
					return BHBuild_Pattern_DeployablesFactory::factoryze($deployable,$params);
				}
			}
		}	
		
		private function extract($tpl) {
			if(isset($tpl) && !empty($tpl)) {
				return $this->goDeep($tpl);
			}
			else throw new Exception("Template: ".$this->templateName. " has no content defined to deploy!!!");
		}
		
		public function setTemplateLocation($templateLocation) {
			if(is_string($templateLocation)) $this->templateLocation = $templateLocation;
		}
		
		public function setTemplateType($templateType) {
			if(is_string($templateType)) $this->templateType = strtolower($templateType);
		}
		
		public function setTemplateName($templateName) {
			if(is_string($templateName)) $this->templateName = $templateName;
		}
		
		public function setDestination($destination) {
			if(is_string($destination)) $this->destination = $destination;
		}
	}
?>
