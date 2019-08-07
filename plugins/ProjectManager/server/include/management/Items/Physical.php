<?php
	abstract class Physical {
		protected $path;		
		public function __construct($path,$icon,$description="",array $authors=array(),$version='1.0'){
			$res = explode("//",$path);
			parent::__construct($res[count($res) - 1],$icon,$description,$authors,$version);
			$this->path = $path;
		}
	}
