<?php

	abstract class BHBuild_Model_Item implements BHBuild_Model_IDeployable
	{
		protected $name;
		protected $path;
		protected $replaceParameters;
		public static $parameters;
		protected $source;
		
		public function __construct($name="",$path="",$replaceParameters=false) {
			$this->name = is_string($name) ? $name : "";
			$this->path = is_string($path) ? $name : "";
			$this->replaceParameters = is_bool($replaceParameters) && $replaceParameters || is_string($replaceParameters) && $replaceParameters == "true" ? true : false;
		}
		
		public function deploy() {}
		
		public function getName() { return $this->name; }
		
		public function setName($name) { if(is_string($name)) $this->name = $name; }
		
		public function getPath() { return $this->path; }
		
		public function setPath($path) { if(is_string($path)) $this->path = $path; }
		
		public function getReplaceParameters() { return $this->replaceParameters; }
		
		public function setReplaceParameters($replaceParameters) { $this->replaceParameters = is_bool($replaceParameters) && $replaceParameters || is_string($replaceParameters) && $replaceParameters == "true"; }
		
		public function getParameters($parameter) { 
			if(array_key_exists($parameter,self::$parameters))
				return self::$parameters[$parameter];
			return self::$parameters;
		}
		
		public function setParameters($parameters) { if(is_array($parameters)) self::$parameters = $parameters; }
		
		public function getSource() { return $this->source; }
		
		public function setSource($source) { if(is_string($source)) $this->source = $source; }				
	}
