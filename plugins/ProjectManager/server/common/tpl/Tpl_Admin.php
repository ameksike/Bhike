<?php
	/**
	 *
	 * @framework: Merma
	 * @package: Tools
	 * @subpackage: Develop
	 * @version: 0.1 

	 * @description: TplAdmin es una libreria para el trabajo con ...
	 * @authors: ing. Antonio Membrides Espinosa
	 * @making-Date: 10/10/2010
	 * @update-Date: 2013/03/27
	 * @license: GPL v2
	 *
	 */
	use Ksike\ksl\base\helpers\Assist;

	class Tpl_Admin {

		public static $path = "templates/";
		private static $ignore = array('.', '..', '.svn');

		public static function getTemplates($type="") {
			$tpl = array();
			$path = self::$path;
			$result = Assist::package("dir")->scan($path,"-i", $this, "categories");
			return $result;
		}

		public static function makeTemplate() {
			
		}

		public static function getDependencies($cat, $type, $tpl) {
			if (self::isBHikeTpl($cat, $type, $tpl)) {
				$res = self::getAll($cat, $type, $tpl);
				$info = $res['data']['dep'];
				return!$res ? false : $info;
			}
			return false;
		}

		public static function getChildren($cat, $type, $tpl) {
			if (self::isBHikeTpl($cat, $type, $tpl)) {
				$res = self::getAll($cat, $type, $tpl);
				$info = $res['data']['child'];
				return!$res ? false : $info;
			}
			return false;
		}

		public static function getReferences($cat, $type, $tpl) {
			if (self::isBHikeTpl($cat, $type, $tpl)) {
				$res = self::getAll($cat, $type, $tpl);
				$info = $res['data']['ref'];
				return!$res ? false : $info;
			}
			return false;
		}

		// (project,default)
		public static function getData($type="project", $tpl='default') {
			$res = self::getTemplate(self::$path . $type . '/' . $tpl);
			$data = $res['TemplateData'];
			return $data;
		}

		public static function getTemplate($resource) {			
			$pieces = explode("/", $resource);			
			$tpl = $pieces[count($pieces) - 1];			
			try{
				$data = Assist::package("config")->load("$resource/", $tpl, "xml");
				return $data['BHTemplate'];	
			}
			catch(Execption $e){
				throw new Exception("Error loading configuration");			
			}        
		}

		public static function getContent($type, $tpl) {
			$res = self::getTemplate(self::$path . $type . '/' . $tpl);
			$content = $res['TemplateContent'];			
			return $content;
		}
		
		public static function getWizardExtension($type="project", $tpl='default') {
			$res = self::getTemplate(self::$path . $type . '/' . $tpl);
			$data = $res['WizardExtension'];
			return $data;
		}
		
		public static function getWizardData($type="project", $tpl='default') {
			$res = self::getTemplate(self::$path . $type . '/' . $tpl);
			$data = $res['WizardData'];
			return $data;
		}
		
		public function onCloseDir($lst, $path) {
			return $lst;
		}

	}
?>
