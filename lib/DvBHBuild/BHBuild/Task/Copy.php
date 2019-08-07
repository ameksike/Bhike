<?php
	
	class BHBuild_Task_Copy extends BHBuild_Task
	{
		private $copiedFiles;
		protected $destinationFolder;
		protected $destinationFiles;
		protected $skipUnchangedFiles;
		protected $sourceFiles;
		
		
		public function __construct($sourceFiles=array(), $destinationFiles=array(),$destinationFolder=array(),$skipUnchangedFiles=true) {
			$this->copiedFiles = array();
			$this->destinationFiles = is_array($destinationFiles) ? $destinationFiles : array();
			$this->destinationFolder = is_string($destinationFolder) ? $destinationFolder : "";
			$this->skipUnchangedFiles = is_bool($skipUnchangedFiles) ? $skipUnchangedFiles : true;
			$this->sourceFiles = is_array($sourceFiles) ? $sourceFiles : array();
		}
		
		public function execute() {
			if(!empty($this->sourceFiles)) {
				$destination = "";
				if($this->destinationFolder != "") $destination = $this->makeDir($this->destinationFolder);		
				
				if(!empty($this->destinationFiles)) {
					for( $i = 0; $i < count($this->sourceFiles); $i++) {						
						$data = pathinfo($this->destinationFiles[$i]);						
						if($destination != "")
							$this->verify($this->sourceFiles[$i],realpath($destination)."/".$data['basename']);
						else {
							if(is_dir( realpath($data['dirname']) ))
								$destination = realpath($data['dirname']);
							else {								
								$sdata = pathinfo($this->sourceFiles[$i]);
								$destination = realpath($sdata['dirname']);
							}						
							$this->verify($this->sourceFiles[$i],$destination."/".$data['basename']);
						}						
					}					
				} else {
					for( $i = 0; $i < count($this->sourceFiles); $i++) {
						$data = pathinfo($this->sourceFiles[$i]);
						if($destination != "")
							$this->verify($this->sourceFiles[$i],realpath($destination)."/".$data['basename']);
						else
							$this->verify($this->sourceFiles[$i],realpath($data['dirname'])."/".$data['filename']."(Copy).".$data['extension']);
					}
				}
				return array("success"=>true,"copiedFiles"=>$this->copiedFiles);
			}
			else throw new Exception("BHBuild_Task 'Copy' says: 'No SourceFiles supplied!!!'");
		}	
		
		private function makeDir($destinationFolder) {
			if(file_exists($this->destinationFolder)) return $this->destinationFolder;
			else {
				$path = pathinfo($this->destinationFolder);
				$makeDir = new BHBuild_Task_MakeDir($path['dirname'],$path['basename']); 
				$makeDir->execute();
				return $this->makeDir(realpath($this->destinationFolder));				
			}
		}
		
		private function verify($source,$destination) {
			$source = realpath($source);
			if($this->skipUnchangedFiles) $this->doCopy($source,$destination);
			else {
				if(file_exists($destination))
					if(filesize($source) != filesize($destination) && filemtime($source) > filemtime($destination)) 
						$this->doCopy($source,$destination);
				$this->doCopy($source,$destination);
			}
		}
		
		private function doCopy($source,$destination) {
			if(copy($source,$destination))
				$this->copiedFiles[] = $destination;
			else {
				return array("success"=>false,"msg"=>"Unable to copy $source to $destination\n");
			}
		}
		
		public function setDestinationFiles($destinationFiles) {
			if(is_array($destinationFiles)) $this->destinationFiles = $destinationFiles;		
		}
		
		public function setDestinationFolder($destinationFolder) {
			if(is_string($destinationFolder)) $this->destinationFolder = $destinationFolder;
		}
		
		public function setSkipUnchangedFiles($skipUnchangedFiles) {
			if(is_bool($skipUnchangedFiles)) $this->skipUnchangedFiles = $skipUnchangedFiles;		
		}
		
		public function setSourceFiles($sourceFiles) {
			if(is_array($sourceFiles)) $this->sourceFiles = $sourceFiles;
		}		
		
		public function getCopiedFiles() {
			return $this->copiedFiles;
		}
	}
