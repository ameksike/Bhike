<?php
	
	class BHBuild_Build 
	{
		private $executer;
		
		public function __construct(){
			$this->executer = new BHBuild_Executer();
		}
		
		public function deployTemplateContent($destination="",$templateLocation="",$templateType="",$templateName="",$parameters = array()) {
			try {
				$array = array(
					"templateName"=>$templateName,
					"templateLocation"=>$templateLocation,
					"templateType"=>$templateType,
					"destination"=>$destination,
					"parameters"=>$parameters
				);
				return $this->executer->DeployTemplateContent($array);
			}catch(Exception $e) { throw $e;}
		}
		
		public function resolveTemplatesData($category,$location,$type,array $filters=array(),$parameters=array()) {		
			$array = array(
				"category"=>$category,
				"location"=>$location,
				"type"=>$type,
				"filters"=>$filters,
				"parameters"=>$parameters
			);
			return $this->executer->ResolveTemplatesData($array);	
		}
		
		public function createFile($path,$name,$content) {
			return $this->executer->CreateFile(array('path'=>$path,'name'=>$name,'content'=>$content));
		}
		
		public function copy($sourceFiles,$destinationFiles=array(),$destinationFolder="",$skipUnchangedFiles=true) {
			/*
			 * Example of use
			 * $array = array(
				"destinationFiles"=>array( --- Optional
					"mine.sms",
					"copy.bak"
				),
				"destinationFolder"=>"/var/www/yadir/XDSC/PLOM/", --- Optional
				"skipUnchangedFiles"=>false, --- Optional
				"sourceFiles"=>array( --- Required
					"/var/www/yadir/Ejemplo/yadir.txt",
					"/var/www/yadir/dev_v1.1.5.4.2.5.rar"
				)
			);*/
			$array = array("destinationFiles"=>$destinationFiles,"destinationFolder"=>$destinationFolder,"skipUnchangedFiles"=>$skipUnchangedFiles,"sourceFiles"=>$sourceFiles);
			return $this->executer->Copy($array);
		}
		
		public function makeDir($path,$name) {
			return $this->executer->MakeDir(array('path'=>$path,'name'=>$name));
		}
		
		public function deleteFiles($files,$deletedFiles,$treatErrorsAsWarnigns=false) {
			return $this->executer->Delete(array("files"=>$files,"deletedFiles"=>$deletedFiles,"treatErrorsAsWarnigns"=>$treatErrorsAsWarnigns));
		}	
	}
