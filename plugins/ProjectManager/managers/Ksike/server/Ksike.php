<?php

	/*
	 * @name: Ksike
	 * @type: class
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This class  is used to manage all Ksike projects. Extends Default project.
	 * */
	
	
	use Ksike\ksl\filter\iface\Loader;
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	include "classes/KsikeContainer.php";
	include "classes/KsikeModule.php";
	include "classes/KsikeApplication.php";
	include "classes/KsikeProject.php";
	
	class Ksike extends Manager //implements Loader
	{	
		public static $artifacts_location = array("application"=>"application","plugin"=>"plugins");
		public static $config_location = array("Project"=>"core/cfg/","application"=>"cfg/","plugins"=>"cfg/");
		public static $metadata_location = array("Project"=>"core/metadata/","application"=>"","plugins"=>"");
		public static $mtd_filename = "metadata";		
		
		public function __construct() { parent::__construct(); }
		
		public function generate($params){
			
		}
		
		public function buildComponent($template,$params) {
			return parent::buildComponent($template,$params);
		}
		
		public function getItems($location,$branch) {
			$project = new KsikeProject($location);
			return $project->getItems($branch);
		}
		
		public function getProjectDescription($path){
			$project = new KsikeProject($path);
			return $project->getDescription();//"Ksike project description!!!";
		}
		
		private function getProjectFromPath($path) {
			//$found = Assist::package("dir")->find()
			//return new CLASS_Project($path);
		}
		
		public function getProjectIcon($project) {
			return "plugins/ProjectManager/managers/Ksike/client/img/icons/icon.png";
		}	
		
		public function removeItems($location,$files,$deletedFiles) {
			$project = new KsikeProject($location);
			return $project->removeItems($files,$deletedFiles);
		}
		
		/*public function onLoad($name)
		{
			print_r($name);
			$path =  __DIR__ ."/classes/";
			if(file_exists("$path$name".KCL_EXT))
				@include $path$name;
		}*/
	}

?>
