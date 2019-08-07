<?php
	class Virtual_Folder {
		
		public function __construct($name,$path,$icon,$description="",array $authors=array(),$version='1.0'){
			parent::__construct($name,$icon,$description,$authors,$version);		
		}
	}
