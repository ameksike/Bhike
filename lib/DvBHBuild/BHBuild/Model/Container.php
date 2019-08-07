<?php

	abstract class BHBuild_Model_Container extends BHBuild_Model_Item implements BHBuild_Model_IContainable
	{		
		protected $content;
		
		public function __construct($name="",$path="",$replaceParameters=false,$content=array()) { 
			parent::__construct($name,$path,$replaceParameters);
			$this->content = is_array($content) ? $content : array();
		}
		
		public function deploy() {
			try {
				$mkdir = new BHBuild_Task_MakeDir($this->getPath(),$this->name); $mkdir->execute();
				if(!empty($this->content)) {
					foreach($this->content as $deployable) {
						$deployable->setPath($this->getPath().$this->getName()."/");
						$deployable->setSource($this->getSource()."/".$deployable->getName());
						$deployable->deploy();
					}
				}
			}
			catch (Exception $e) { throw $e; }
		}
		
		public function getContent() { return $this->content;}
		
		public function setContent($content) { if(is_array($content)) $this->content = $content; }
	}
