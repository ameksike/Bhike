<?php
	use Ksike\ksl\filter\control\Plugin;
	use Ksike\ksl\base\helpers\Assist;
	
	class CodeEditor extends Plugin
	{
		public function __construct() {}
		
		public function initialize(){
			$path = Assist::router("this")."data/";
			$settings = Assist::package("config")->load($path, "settings");
			!empty($settings['editor']['theme']['current']) ? $theme = $settings['editor']['theme']['current'] : $theme = $settings['editor']['theme']['default'];
			!empty($settings['editor']['mode']['current']) ? $mode = $settings['editor']['mode']['current'] : $mode = $settings['editor']['mode']['default'];
			return array('theme' => $theme,'mode'=>$mode);
		}
		
		public function openFile($params){
			$file = $params->path.$params->item;
			if(file_exists($file))
				return array('success'=>true,'file'=>$params->item,'path'=>$params->path,'content'=>file_get_contents($file));
			else
				return array('success'=>false,'msg'=>"Error while openning file. File doesn't exists.");
		}
		
		public function saveFile($params){
			//print_r($_REQUEST);die('Algoo');
			try{
				if(file_put_contents($params->file,$_REQUEST['test']))
					return array('success'=>true,'file'=>$params->file);
				else
					return array('success'=>false,'msg'=>"Error while saving the file $params->file.");
			}catch(Exception $e){
				return array('success'=>false,'msg'=>$e);
			}
		}
	}
?>
