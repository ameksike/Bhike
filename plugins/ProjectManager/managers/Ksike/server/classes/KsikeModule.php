<?php
	/*
	 * @name: KsikeModule
	 * @type: class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This class  is used to instanciate every Ksike plugin or module. Extends KsikeContainer.
	 * */
	
	class KsikeModule extends KsikeContainer
	{
		public function __construct($location="plugins/",$mtd_location="mtd/") {
			parent::__construct($location,$mtd_location);
		}
		
		public function getItems($branch) {
			return parent::getItems($this->getTruePath($branch));
		}
		
		public function removeItems($file,$deletedFiles){
			print_r($this->getTruePath($file));die("/***************");
			//return parent::removeItems($this->getTruePath($file),$deletedFiles);
		}
		
		private function getTruePath($branch) {
			return str_replace(substr($this->location,strpos($this->location,"plugins/"),strlen($this->location)-1),"",$branch);
		}
	}
