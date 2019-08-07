<?php

/**
 *
 * @framework: Merma
 * @package: Tools
 * @subpackage: Develop
 * @version: 0.1 

 * @description: Project es una libreria para el trabajo con ...
 * @authors: ing Antonio Membrides Epinosa, Yadir Hernández Batista
 * @making-Date: 10/12/2011
 * @update-Date: 10/12/2011
 * @license: GPL v2
 *
 */ 
use Ksike\ksl\base\bundles\Driver; 

class Dev_Item extends Dev_Container {
	
	private $tplName;
    public function __construct($data, $path="../../", $tpl="Ksike/", $tplPath="templates/item/") {
		$this->tplName = $tpl;
        parent::__construct($data, $tplPath . 'item/' . $tpl, $path);
    }

    public function build() {
		$GLOBALS = $this->data;
		$file = $this->tpl.'/'.$this->tplName.'.xml';
		if(file_exists($file)){
			$tpl = file_get_contents($file);
			
			ob_start();
			
			$tpl = Hard_Manager::formatTplPHP($tpl, true);		
			
			eval('?><?php echo "' . $tpl . '";?><?php ');
			//print_r(count($tpl);die;
			$data = Hard_Manager::formatTplPHP(ob_get_contents());
			ob_end_clean();
			$content = Driver::this('XML')->toArray( $data );
			
			$content = $content['BHTemplate']['TemplateContent'];
			
			//print_r($content);die;
			
			if(isset($content['Item']['Value']))
				Hard_Manager::createFileFromTpl($this->tpl . '/' . $content['Item']['@attributes']['TargetFileName'], $this->path . $content['Item']['Value'], $this->data);
			else
				foreach($content['Item'] as $i){
					Hard_Manager::createFileFromTpl($this->tpl . '/' . $i['@attributes']['TargetFileName'], $this->path . $i['Value'], $this->data);
				}			
		}

    }
}

?>
