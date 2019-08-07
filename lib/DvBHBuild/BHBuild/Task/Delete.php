<?php
	
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class BHBuild_Task_Delete extends BHBuild_Task
	{
		private $deletedFiles;
		private $files;
		private $treatErrorsAsWarnigns;
		private $content = array();
		
		public function __construct(){
			$this->deletedFiles = array();
			$this->files = array();
			$this->treatErrorsAsWarnigns = false;
		}		
		
		public function execute(){
			$this->goDeep($this->files);
			return $this->deletedFiles;
		}
		
		private function removeDir($item){
			rmdir($item); $this->deletedFiles[] = $item;
		}
		
		private function removeFile($item){
			unlink($item); $this->deletedFiles[] = $item;
		}
		
		private function goDeep ($files) {
			if(!empty($files)) foreach($files as $item) $this->remove($item);
		}
		
		private function remove($item){
			if(is_file($item)) $this->removeFile($item);
			else if(is_dir($item)) {
				$this->content = array();
				Assist::package("dir")->scan($item."/", "-i", $this);
				if(empty($this->content)) $this->removeDir($item);
				else { $this->goDeep($this->content); $this->removeDir($item); }
			}			
		}
		
		public function onFind($lst, $path, $params='',$item, $type='') {
			$this->content[] = $path.$item;
		}
		
		public function setFiles(array $files) {
			$this->files = $files;
		}
		
		public function setDeletedFiles(&$deletedFiles)
		{
			$this->deletedFiles = $deletedfiles;
		}
		
		public function setTreatErrorsAsWarnigns($treatErrorsAsWarnigns = false) {
			$this->treatErrorsAsWarnigns = $treatErrorsAsWarnigns;
		}
	}
?>
