<?php
	use Ksike\ksl\filter\control\Plugin; 
	use Ksike\ksl\base\helpers\Assist as kcl;
	class Linker extends Plugin 
	{
		public function getControllers($params) 
		{		
			$classes = array('class.php','class1.php','class2.php');		
			$parser = kcl::driver("PHPParser");
			//print_r($parser);die;
			$result = array();
			foreach($classes as $class){
				$file = kcl::router()->this."data/classes/$class";
				$data = $parser->getClassData($file);
				$data['file'] = $file;
				$result[] = $data;
			}
			
			return json_encode(array('classes_data'=>$result));
		}
		
		public function saveDiagram($params) 
		{		
			$params = json_decode($_REQUEST['data']);
			print_r($params);
			$oFile = kcl::router()->this."data/linker.xml";
			$tpl = kcl::router()->this."data/linker.twig";
			$twig = kcl::driver("Twig");
			
			$out = $twig->tplString2Doc(file_get_contents($tpl),array('data'=>$params));		
			file_put_contents($oFile,$out);
			//return 
		}
		
		public function openFile($params){
			$file = $_GET['file'];
			$path = kcl::router("this").$file;
			print_r($path);
			if(file_exists($path)){
				$data = kcl::package("config")->load($path);
				print_r($data);die;
				if($data != null) {
					$data['Linker']['Data']['FileName'] = $path;
					return json_encode(array('success'=>true,'data'=>$data));
				}
				return json_encode(array('success'=>false,'msg'=>"Error loading XML data from $file"));
			}
			return json_encode(array('success'=>false,'msg'=>'File not found!!!'));
		}
	}
?>
