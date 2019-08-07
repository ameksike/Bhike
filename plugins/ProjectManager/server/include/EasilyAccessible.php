<?php
	class EasilyAccessible
	{
		public function __call($method, $args) {	 
			$methodType = substr($method, 0, 3);
			$attribName = substr($method, 3);
			if(strtolower($methodType) == "set" ){
				$this->setAttrib($attribName, $args[0]);
			}
			
			if( strtolower($methodType) == "get" ){
				return $this->getAttrib($attribName);
			}
		}
		 
		protected function setAttrib($attribName, $value){
			$attrib = strtolower($attribName);
			$this->$attrib = $value;
		}

		protected function getAttrib($attribName){
			$attrib = strtolower($attribName);
			return $this->$attrib;
		}
	}
?>
