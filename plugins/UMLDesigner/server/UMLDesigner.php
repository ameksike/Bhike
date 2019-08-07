<?php
	use Ksike\ksl\filter\control\Plugin;
	use Ksike\ksl\base\helpers\Assist;
	
	class UMLDesigner extends Plugin
	{
		public function __construct() {}	
		public function initialize(){
			
		}
		
		public function openFile($params){
			$file = $params->path.$params->item;
			if(file_exists($file))
				return array('success'=>true,'file'=>$params->item,'path'=>$params->path,'content'=>file_get_contents($file));
			else
				return array('success'=>false,'msg'=>"Error while openning file. File doesn't exists.");
		}
		
		public function saveFile($params){
			//print_r($params);die;
			if(file_put_contents($params->file,$params->data))
				return array('success'=>true,'file'=>$params->file);
			else
				return array('success'=>false,'msg'=>"Error while saving the file $params->file.");
		}
	}
?>
