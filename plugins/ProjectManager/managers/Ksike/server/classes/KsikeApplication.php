<?php
	/*
	 * @name: KsikeApplication
	 * @type: class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This class  is used to instanciate every Ksike application. Extends Default project.
	 * */
	
	//include "KsikeContainer.php";
	
	class KsikeApplication extends KsikeContainer
	{
		
		public function __construct($location="app/",$mtd_location="mtd/") { 
				parent::__construct($location,$mtd_location);
		}		
	
		public function getItems($branch){
			return parent::getItems(str_replace("app/","",$branch));
		}
		
		public function removeItems($file,$deletedFiles){
			return parent::removeItems(str_replace("app/","",$file),$deletedFiles);
		}
	}
